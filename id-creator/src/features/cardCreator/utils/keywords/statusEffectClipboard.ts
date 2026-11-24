import { KeywordMap, toKeywordKey } from "features/cardCreator/utils/keywords/keywords"
import { sanitizeCardHtml } from "utils/htmlUtils"

export const STATUS_EFFECT_SELECTOR = "[data-status-effect], span[contenteditable='false']"

const BLOCK_TAGS = new Set(["P", "DIV", "LI", "H1", "H2", "H3", "H4", "H5", "H6"])

const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE

export const isStatusEffect = (node: Node): boolean => isElement(node) && node.matches(STATUS_EFFECT_SELECTOR)

export const statusEffectName = (node: Node): string => (node.textContent ?? "").replace(/\s+/g, " ").trim()

export function statusEffectNameFromHtml(html: string): string {
    const template = document.createElement("template")
    template.innerHTML = sanitizeCardHtml(html)
    return statusEffectName(template.content)
}

export function containsStatusEffect(root: ParentNode): boolean {
    return root.querySelector(STATUS_EFFECT_SELECTOR) !== null
}

export function toPlainText(root: Node, renderStatus: (el: Element) => string): string {
    const lines: string[] = [""]
    const write = (text: string) => { lines[lines.length - 1] += text }
    const breakLine = () => { if (lines[lines.length - 1] !== "") lines.push("") }

    const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) return write(node.textContent ?? "")
        const element = isElement(node) ? node : null
        if (!element && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return
        if (element && isStatusEffect(element)) return write(renderStatus(element))
        if (element?.tagName === "BR") return void lines.push("")
        const isBlock = element !== null && BLOCK_TAGS.has(element.tagName)
        if (isBlock) breakLine()
        node.childNodes.forEach(walk)
        if (isBlock) breakLine()
    }

    walk(root)
    return lines.join("\n").replace(/\n+$/, "")
}

export interface StatusEffectClipboard {
    text: string
    html: string
}

export function selectionClipboard(selection: Selection | null): StatusEffectClipboard | null {
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null
    const container = document.createElement("div")
    for (let i = 0; i < selection.rangeCount; i++) {
        container.appendChild(selection.getRangeAt(i).cloneContents())
    }
    if (!containsStatusEffect(container)) return null
    return { text: toPlainText(container, statusEffectName), html: container.innerHTML }
}

const statusHtmlOf = (el: Element) => sanitizeCardHtml(el.getAttribute("data-status-effect") ?? el.outerHTML)

const keysByHtml = (matchList: KeywordMap) =>
    new Map(Object.keys(matchList).map(key => [sanitizeCardHtml(matchList[key]), key]))

function findKeywordKey(el: Element, matchList: KeywordMap, byHtml: Map<string, string>): string | null {
    const exact = byHtml.get(statusHtmlOf(el))
    if (exact) return exact
    const byName = toKeywordKey(statusEffectName(el))
    return byName && Object.hasOwn(matchList, byName) ? byName : null
}

export function keywordKeyFinder(matchList: KeywordMap): (el: Element) => string | null {
    const byHtml = keysByHtml(matchList)
    return el => findKeywordKey(el, matchList, byHtml)
}

export const keywordKeyOf = (el: Element, matchList: KeywordMap): string | null => keywordKeyFinder(matchList)(el)

export function htmlToKeywordText(html: string, matchList: KeywordMap): string {
    const template = document.createElement("template")
    template.innerHTML = html
    const findKey = keywordKeyFinder(matchList)
    return toPlainText(template.content, el => {
        const key = findKey(el)
        return key ? `[${key}]` : statusEffectName(el)
    })
}
