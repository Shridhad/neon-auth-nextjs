
import { AUTH_BASE_URL } from "@/lib/auth"
import { toNextJsHandler } from "@/lib/middleware"

export const { GET, POST } = toNextJsHandler(AUTH_BASE_URL)

// export const { POST, GET } = handler

// export async function GET(request: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
//   const resolvedParams = await params;
//   console.log("resolvedParams: ", resolvedParams)
//   const path = resolvedParams.all.join('/');
//   const url = new URL(request.url);
//   // Construct upstream URL (strip /api/auth prefix)
//   const upstreamURL = `${auth.options.baseURL}/${path}${url.search}`;

//   console.log(`[Auth Proxy] ${request.method} /api/auth/${path} -> ${upstreamURL}`);

//   const newRequest  = new Request(upstreamURL, {
//     method: request.method,
//     headers: request.headers,
//     body: request.body,
//   })
//   console.log("GET request ", request.url, request.headers)
//   const response = await handler.GET(newRequest)
//   console.log("GET response", response.status, response.statusText, response.headers)
//   return response
// }

// export async function POST(request: Request) {  
//     console.log("POST request ", request.url, request.headers)
//     const response = await handler.POST(request)
//     console.log("POST response", response)
//     return response
// }