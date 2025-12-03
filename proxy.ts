import { neonAuthMiddleware } from "@neondatabase/neon-auth-next"

export default neonAuthMiddleware({
  loginUrl: "/auth/sign-in",
})

export const config = {
  matcher: [
    "/dashboard",
    "/account",
    "/((?!_next/static|_next/image|favicon.ico|).*)",
  ],
}