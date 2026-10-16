import { CONTACT_ADMIN_MESSAGE, UNAVAILABLE_TITLES, getErrorMessage } from "api/errorCodes";

export interface UnavailableContent {
    title: string
    message: string
}

const FALLBACK: UnavailableContent = { title: "Content unavailable", message: `This content is no longer available. ${CONTACT_ADMIN_MESSAGE}` }

export function getUnavailableContent(code: string): UnavailableContent {
    const title = (UNAVAILABLE_TITLES as Record<string, string>)[code]
    const message = getErrorMessage(code)
    return title && message ? { title, message } : FALLBACK
}
