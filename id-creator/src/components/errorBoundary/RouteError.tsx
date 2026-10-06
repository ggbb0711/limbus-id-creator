'use client'
import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorFallback from "./ErrorFallback";

export default function RouteError({ error, retry }: { error: Error & { digest?: string }, retry: () => void }) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return <ErrorFallback onRetry={retry} />
}
