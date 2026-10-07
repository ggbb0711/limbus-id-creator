import sanitizeHtml, { type IOptions, type Transformer } from "sanitize-html"
import { convert } from "html-to-text"

const RICH_TEXT_TAGS = [
    "p", "div", "br", "span", "b", "strong", "i", "em", "u", "s", "strike",
    "ul", "ol", "li", "a", "img", "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "pre", "code", "hr",
]

const RICH_TEXT_ATTRIBUTES = ["href", "src", "alt", "title", "class", "style", "target", "rel"]

const CARD_ATTRIBUTES = ["contenteditable", "data-status-effect", "data-custom-coin-effect", "width", "height"]

const SAFE_DATA_IMAGE = /^data:image\/(?:png|jpe?g|webp|gif);base64,/i

const secureAttributes: Transformer = (tagName, attribs) => {
    const next = { ...attribs }
    if (next.target === "_blank") next.rel = "noopener noreferrer"
    else delete next.target
    if (tagName === "img" && next.src?.trim().toLowerCase().startsWith("data:") && !SAFE_DATA_IMAGE.test(next.src.trim())) delete next.src
    return { tagName, attribs: next }
}

const POST_OPTIONS: IOptions = {
    allowedTags: RICH_TEXT_TAGS,
    allowedAttributes: { "*": RICH_TEXT_ATTRIBUTES },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    parseStyleAttributes: false,
    transformTags: { "*": secureAttributes },
}

const CARD_OPTIONS: IOptions = {
    ...POST_OPTIONS,
    allowedAttributes: { "*": [...RICH_TEXT_ATTRIBUTES, ...CARD_ATTRIBUTES] },
}

const sanitizeWith = (options: IOptions) => (html: string | null | undefined): string =>
    html ? sanitizeHtml(html, options) : ""

export const sanitizePostHtml = sanitizeWith(POST_OPTIONS)

export const sanitizeCardHtml = sanitizeWith(CARD_OPTIONS)

export const stripHtml = (html: string): string =>
    convert(html, {
        wordwrap: false,
        selectors: [
            { selector: "a", options: { ignoreHref: true } },
            { selector: "img", format: "skip" },
        ],
    }).replace(/\s+/g, " ").trim()
