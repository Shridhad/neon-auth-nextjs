
import { AUTH_BASE_URL } from "@/lib/auth"
import { toNextJsHandler } from "@neondatabase/neon-auth-next"

export const { GET, POST } = toNextJsHandler(AUTH_BASE_URL)