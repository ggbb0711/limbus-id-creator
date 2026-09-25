'use client'
import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorFallback from "components/errorBoundary/ErrorFallback";

export default function Error({ error, retry }: { error: Error & { digest?: string }, retry: () => void }) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return <ErrorFallback onRetry={retry} />
}
