import Link from "next/link"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { TokenDisplay } from "./token-display"

// This is a Server Component (no "use client" directive)
// It can directly fetch data, access databases, read files, etc.

// Fetch real data from external API
async function getQuoteOfTheDay() {
  try {
    const res = await fetch("https://api.quotable.io/random", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    if (!res.ok) throw new Error("Failed to fetch quote")
    const data = await res.json()
    return {
      content: data.content,
      author: data.author,
      tags: data.tags,
    }
  } catch (error) {
    return {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tags: ["inspirational"],
    }
  }
}

// Get session data from cookies (server-side only!)
async function getSessionFromCookies() {
  const cookieStore = await cookies()
  
  // Look for the Neon Auth session cookie
  const sessionCookie = cookieStore.get('__Secure-neon-auth.session_token')
  
  return {
    hasSession: !!sessionCookie,
    cookieName: '__Secure-neon-auth.session_token',
    sessionToken: sessionCookie?.value || '',
    tokenLength: sessionCookie?.value.length || 0,
  }
}

// Server-only computation
function analyzeData() {
  const serverTime = new Date()
  return {
    serverTime: serverTime.toISOString(),
    requestId: Math.random().toString(36).substring(7),
    environment: process.env.NODE_ENV || "development",
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dayOfWeek: serverTime.toLocaleDateString("en-US", { weekday: "long" }),
    isWeekend: serverTime.getDay() === 0 || serverTime.getDay() === 6,
  }
}

export default async function QuotePage() {
  // All data fetching happens in parallel on the server
  const [quote, sessionData, serverData] = await Promise.all([
    getQuoteOfTheDay(),
    getSessionFromCookies(),
    Promise.resolve(analyzeData()),
  ])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              Quote of the Day
            </h1>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Server Component
            </span>
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Get inspired with a fresh quote every hour. This page demonstrates server-side rendering - fetching data and reading cookies with zero client-side JavaScript!
          </p>
        </div>

        {/* Quote of the Day - Featured Section */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm dark:border-zinc-800 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="mb-2 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Quote of the Day
            </h2>
          </div>
          <blockquote className="mt-4 text-xl italic text-zinc-700 dark:text-zinc-300">
            &ldquo;{quote.content}&rdquo;
          </blockquote>
          <p className="mt-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
            — {quote.author}
          </p>
          {quote.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {quote.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Real-Time Data Display */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Session Data Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Session from Cookies
              </h2>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Session Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${sessionData.hasSession ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {sessionData.hasSession ? 'Active' : 'Not logged in'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Cookie Name</p>
                <div className="mt-1 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                    {sessionData.cookieName}
                  </p>
                </div>
              </div>
              {sessionData.hasSession ? (
                <>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Token Length</p>
                    <p className="mt-1 font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {sessionData.tokenLength} characters
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Session Token</p>
                    <TokenDisplay token={sessionData.sessionToken} />
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <Link href="/auth/sign-in">
                    <Button size="sm" className="w-full">
                      Sign In to See Session
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Server Time Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Server Time
              </h2>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Current Day</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {serverData.dayOfWeek}
                  {serverData.isWeekend && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Weekend!
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Rendered At</p>
                <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">
                  {new Date(serverData.serverTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Server Timezone</p>
                <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">
                  {serverData.serverTimezone}
                </p>
              </div>
            </div>
          </div>

          {/* Environment Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Server Info
              </h2>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Request ID</p>
                <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">
                  {serverData.requestId}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Environment</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${serverData.environment === 'production' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <p className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                    {serverData.environment}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Features</p>
                <ul className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> Zero client JS
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> Server-side rendering
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> Parallel data fetching
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Fetching Patterns */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Real-World Use Cases
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Database Queries
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Directly query your Neon Postgres database without exposing connection strings
                to the client.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Cookie & Session Access
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Read cookies and session data directly on the server - perfect for auth checks
                and personalized content.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg
                  className="h-5 w-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Fast Initial Load
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Pre-render content on the server for instant page loads with fully populated
                data - no loading spinners!
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Server Components
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Data fetching happens on the server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>No client-side JavaScript bundle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Direct access to backend resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Better SEO with pre-rendered content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Automatic code splitting</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950/30">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                <span className="text-sm font-bold text-white">JS</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Client Components
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Requires &ldquo;use client&rdquo; directive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>JavaScript sent to browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Can use hooks like useState, useEffect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Needed for interactivity and event handlers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Data fetching happens in browser</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link href="/">
            <Button variant="outline">
              ← Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

