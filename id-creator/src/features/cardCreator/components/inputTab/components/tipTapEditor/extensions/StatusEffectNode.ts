import { Node } from "@tiptap/core"
import { sanitizeCardHtml } from "utils/sanitizeHtml"

const StatusEffectNode = Node.create({
    name: "statusEffect",
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            html: {
                default: "",
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: "span[data-status-effect]",
                getAttrs: (node) => {
                    const el = node as HTMLElement
                    return { html: sanitizeCardHtml(el.getAttribute("data-status-effect")) }
                },
            },
            {
                tag: "span[contenteditable='false']",
                getAttrs: (node) => {
                    const el = node as HTMLElement
                    return { html: sanitizeCardHtml(el.outerHTML) }
                },
            },
        ]
    },

    renderHTML({ node }) {
        const html = sanitizeCardHtml(node.attrs.html)
        const wrapper = document.createElement("span")
        wrapper.setAttribute("data-status-effect", html)
        wrapper.innerHTML = html
        return { dom: wrapper }
    },

    addNodeView() {
        return ({ node }) => {
            const html = sanitizeCardHtml(node.attrs.html)
            const dom = document.createElement("span")
            dom.setAttribute("data-status-effect", html)
            dom.innerHTML = html
            dom.contentEditable = "false"
            return { dom }
        }
    },
})

export default StatusEffectNode