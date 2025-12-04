import { toNextJsHandler } from "@neondatabase/neon-auth-next"

export const { GET, POST } = toNextJsHandler(
  process.env.NEON_AUTH_BASE_URL!
)

