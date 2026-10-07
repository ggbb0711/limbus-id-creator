import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit"
import { reportError } from "utils/reportError"

const EXPECTED_STATUSES = new Set<unknown>([401, 404])

interface RejectedApiAction {
    payload: unknown
    meta?: { arg?: { endpointName?: string, originalArgs?: unknown } }
}

export const shouldReportApiError = (payload: unknown): boolean =>
    !EXPECTED_STATUSES.has((payload as { status?: unknown } | undefined)?.status)

export const rtkQueryErrorReporter: Middleware = () => next => action => {
    if (isRejectedWithValue(action)) {
        const { payload, meta } = action as RejectedApiAction
        if (shouldReportApiError(payload)) {
            reportError(payload, { context: `api:${meta?.arg?.endpointName ?? "unknown"}` })
        }
    }
    return next(action)
}
