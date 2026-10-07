import DOMPurify, { type Config } from "isomorphic-dompurify"

const RICH_TEXT_TAGS = [
    "p", "div", "br", "span", "b", "strong", "i", "em", "u", "s", "strike",
    "ul", "ol", "li", "a", "img", "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "pre", "code", "hr",
]

const RICH_TEXT_ATTRIBUTES = ["href", "src", "alt", "title", "class", "style", "target", "rel"]

const SAFE_URI = /^(?:(?:https?|mailto):|data:image\/(?:png|jpe?g|webp|gif);base64,|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i

const POST_CONFIG: Config = {
    ALLOWED_TAGS: RICH_TEXT_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ATTRIBUTES,
    ALLOWED_URI_REGEXP: SAFE_URI,
    ALLOW_DATA_ATTR: false,
}

const CARD_CONFIG: Config = {
    ...POST_CONFIG,
    ALLOWED_ATTR: [...RICH_TEXT_ATTRIBUTES, "contenteditable", "data-status-effect", "data-custom-coin-effect", "width", "height"],
}

DOMPurify.addHook("afterSanitizeAttributes", node => {
    if (!node.hasAttribute("target")) return
    if (node.getAttribute("target") === "_blank") node.setAttribute("rel", "noopener noreferrer")
    else node.removeAttribute("target")
})

const sanitizeWith = (config: Config) => (html: string | null | undefined): string =>
    html ? String(DOMPurify.sanitize(html, config)) : ""

export const sanitizePostHtml = sanitizeWith(POST_CONFIG)

export const sanitizeCardHtml = sanitizeWith(CARD_CONFIG)

const TEXT_NODE = 3

const textNodes = (node: Node): string[] =>
    node.nodeType === TEXT_NODE ? [node.nodeValue ?? ""] : Array.from(node.childNodes).flatMap(textNodes)

export const stripHtml = (html: string): string =>
    textNodes(DOMPurify.sanitize(html, { RETURN_DOM: true, FORBID_TAGS: ["style"] }))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
