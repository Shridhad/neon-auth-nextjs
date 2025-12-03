"use client"

// import { UserButton } from "@daveyplate/better-auth-ui"
import { UserButton } from "@neondatabase/neon-auth-ui"
import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    const { data: session } = authClient.useSession()

    return (
        <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-4 backdrop-blur md:h-14 md:px-6">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                    <svg
                        className="size-5"
                        fill="none"
                        height="45"
                        viewBox="0 0 60 45"
                        width="60"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            className="fill-black dark:fill-white"
                            clipRule="evenodd"
                            d="M0 0H15V45H0V0ZM45 0H60V45H45V0ZM20 0H40V15H20V0ZM20 30H40V45H20V30Z"
                            fillRule="evenodd"
                        />
                    </svg>
                    <span className="hidden sm:inline">Neon Auth Next.js</span>
                </Link>
                {session && (
                    <nav className="flex items-center gap-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                Dashboard
                            </Button>
                        </Link>
                    </nav>
                )}
            </div>

            <div className="flex items-center gap-2">
                <ModeToggle />
                <UserButton size="icon" />
            </div>
        </header>
    )
}