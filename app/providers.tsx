"use client"

// import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { NeonAuthUIProvider } from "@neondatabase/neon-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <NeonAuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh()
            }}
            // magicLink
            emailOTP
            social={{
                providers: ["google", "github"]
            }}
            redirectTo="/dashboard"
            Link={Link}
        >
            {children}
        </NeonAuthUIProvider>
    )
}