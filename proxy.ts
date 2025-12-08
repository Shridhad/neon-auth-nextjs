import { neonAuthMiddleware } from "@neondatabase/auth/next"

export default neonAuthMiddleware({
  loginUrl: "/auth/sign-in",
})

export const config = {
  matcher: [
    "/dashboard",
    "/account",
    "/quote",
    "/((?!_next/static|_next/image|favicon.ico|).*)",
  ],
}