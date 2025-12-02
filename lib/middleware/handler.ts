import { NextRequest, NextResponse } from "next/server"
import { proxy } from "./proxy"

type Params = { path: string[] }
export const toNextJsHandler = (baseUrl: string) => {
  const handler = async (request: NextRequest, {params}: {params: Promise<Params>}) => {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const response = await proxy(baseUrl, request, path)

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }
 

  return {
    GET: handler,
    POST: handler,
    PUT: handler,
    DELETE: handler,
    PATCH: handler,
  }
}

