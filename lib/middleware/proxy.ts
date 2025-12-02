const NEXT_AUTH_COOKIE_PREFIX = '__Secure-neon-auth';
export const proxy = async (baseUrl: string, request: Request, path: string) => {
  const upstreamURL = `${baseUrl}/${path}`;
  const headers = toNeonAuthHeaders(request);
  const body = await getRequestBody(request);
  console.debug("[Auth Proxy] Request: ", request.method, upstreamURL, headers);

  try {
    const response = await fetch(upstreamURL, {
      method: request.method,
      headers: headers,
      body: body,
    })
    console.debug("[Auth Proxy] Response: ", request.url, response.status, response.statusText);

    const cookies = response.headers.get('set-cookie');
    console.debug("[Auth Proxy] Cookies: ", cookies);
    console.debug("[Auth Proxy] Response Headers: ", response.headers);

    return response;
  } catch (error) {
    console.error("[Auth Proxy] Error: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


const PROXY_HEADERS = ['user-agent', 'authorization', 'referer'];
const toNeonAuthHeaders = (request: Request) => {
  const headers = new Headers();

  headers.set('Content-Type', 'application/json');
  
  PROXY_HEADERS.forEach(header => {
    if (request.headers.get(header)) {
      headers.set(header, request.headers.get(header)!);
    }
  });
  
  headers.set('Origin', getOrigin(request));
  headers.set('Cookie', getCookies(request));
  return headers;
}


// Get the origin from the requst headers or the url
const getOrigin = (request: Request) => {
 return request.headers.get('origin') ||
                   request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
                   new URL(request.url).origin;
}

const getCookies = (request: Request) => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return '';

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const result: string[] = [];

  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    if (name.startsWith(NEXT_AUTH_COOKIE_PREFIX)) {
      result.push(cookie);
    }
  }

  return result.join(';');
}

const getRequestBody = async (request: Request) => {
  if (request.body) {
    return request.text();
  }

  return undefined;
}
