export const CONTACT_ADMIN_MESSAGE = "If you think this is a mistake, please contact the site admin on Discord:"

export const ERROR_MESSAGES = {
    INVALID_ACCESS_TOKEN: "Your session has expired. Please log in again.",
    INVALID_REFRESH_TOKEN: "Your session has expired. Please log in again.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    ACCOUNT_INACTIVE: "This account no longer exists or is inactive.",
    GOOGLE_TOKEN_FAILED: "Google sign-in failed. Please try again.",
    USER_NOT_FOUND: "This user does not exist.",
    NOT_SAME_USER: "You can only edit your own profile.",
    USER_BANNED: `This account has been banned. ${CONTACT_ADMIN_MESSAGE}`,
    POST_NOT_FOUND: "This post does not exist.",
    POST_REMOVED: `This post has been removed by the site admin. ${CONTACT_ADMIN_MESSAGE}`,
    POST_AUTHOR_BANNED: `The author of this post has been banned. ${CONTACT_ADMIN_MESSAGE}`,
    SAVE_NOT_FOUND: "This save does not exist.",
    SAVE_UPDATE_FAILED: "This save could not be updated.",
    RESOURCE_NOT_OWNED: "You do not own this save.",
    VALIDATION_FAILED: null,
    INTERNAL_ERROR: "Something went wrong with the server",
} as const satisfies Record<string, string | null>

export type ErrorCode = keyof typeof ERROR_MESSAGES

export const isErrorCode = (code: unknown): code is ErrorCode =>
    typeof code === "string" && Object.hasOwn(ERROR_MESSAGES, code)

export const UNAVAILABLE_TITLES = {
    POST_REMOVED: "Post removed",
    POST_AUTHOR_BANNED: "Post unavailable",
    USER_BANNED: "User banned",
} as const satisfies Partial<Record<ErrorCode, string>>

export const getErrorMessage = (code: unknown): string | null =>
    isErrorCode(code) ? ERROR_MESSAGES[code] : null
