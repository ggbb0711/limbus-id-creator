import * as Sentry from "@sentry/nextjs"

export interface ErrorContext {
    context: string
    extra?: Record<string, unknown>
}

export function toError(error: unknown): Error {
    if (error instanceof Error) return error
    if (typeof error === "string") return new Error(error)
    if (typeof error === "object" && error !== null && "status" in error) {
        const { status, error: detail } = error as { status: unknown, error?: unknown }
        return new Error(`API error ${String(status)}${typeof detail === "string" ? `: ${detail}` : ""}`)
    }
    try {
        return new Error(JSON.stringify(error))
    } catch {
        return new Error(String(error))
    }
}

export function reportError(error: unknown, { context, extra }: ErrorContext): void {
    Sentry.captureException(toError(error), { tags: { context }, extra })
    if (process.env.NODE_ENV !== "production") console.error(`[${context}]`, error)
}
