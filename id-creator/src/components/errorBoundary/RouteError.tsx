'use client'
import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorFallback from "./ErrorFallback";

export interface RouteErrorProps {
    error: Error & { digest?: string }
    retry: () => void
}

export default function RouteError({ error, retry }: RouteErrorProps) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return <ErrorFallback onRetry={retry} />
}
