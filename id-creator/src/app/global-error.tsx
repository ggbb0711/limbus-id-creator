'use client'
import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import "styles/reset.css";
import "styles/style.css";
import ErrorFallback from "components/errorBoundary/ErrorFallback";

// Replaces the root layout when it crashes, so it renders its own <html>/<body>.
// No next/font here: this is a client component (fonts fall back to sans-serif on this page).
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }, retry: () => void }) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return (
        <html lang="en">
            <body>
                <ErrorFallback onRetry={retry} />
            </body>
        </html>
    )
}
