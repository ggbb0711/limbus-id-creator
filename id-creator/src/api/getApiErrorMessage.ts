import IResponse from "types/IResponse";

export const NETWORK_ERROR_MESSAGE = "Can't reach the server. Check your connection."
export const TOO_LARGE_MESSAGE = "That file is too large."

const STATUS_MESSAGES: Record<string | number, string> = {
    FETCH_ERROR: NETWORK_ERROR_MESSAGE,
    TIMEOUT_ERROR: NETWORK_ERROR_MESSAGE,
    413: TOO_LARGE_MESSAGE,
}

export default function getApiErrorMessage(error: unknown, fallback = "Something went wrong with the server"): string {
    const { data, status } = (error ?? {}) as { data?: Partial<IResponse<unknown>>, status?: string | number }
    if (data && typeof data === "object" && typeof data.message === "string" && data.message) return data.message
    if (status !== undefined && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]
    return fallback
}
