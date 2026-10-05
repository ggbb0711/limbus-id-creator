const HTML_ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}

export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, char => HTML_ESCAPES[char])

const SAFE_CSS_COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%a-z]+\)|var\(--[\w-]+\)|[a-z]+)$/i

export const isSafeCssColor = (value: string): boolean => SAFE_CSS_COLOR.test(value.trim())

const SAFE_IMAGE_URL = /^(data:image\/[a-z+]+;base64,|https?:\/\/|\/)/i

export const isSafeImageUrl = (value: string): boolean => SAFE_IMAGE_URL.test(value.trim())
