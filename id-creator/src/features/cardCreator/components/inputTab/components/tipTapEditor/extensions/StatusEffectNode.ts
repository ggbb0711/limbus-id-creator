import { Node } from "@tiptap/core"

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
                    return { html: el.getAttribute("data-status-effect") }
                },
            },
            {
                tag: "span[contenteditable='false']",
                getAttrs: (node) => {
                    const el = node as HTMLElement
                    return { html: el.outerHTML }
                },
            },
        ]
    },

    renderHTML({ node }) {
        const wrapper = document.createElement("span")
        wrapper.setAttribute("data-status-effect", node.attrs.html)
        wrapper.innerHTML = node.attrs.html
        return { dom: wrapper }
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement("span")
            dom.setAttribute("data-status-effect", node.attrs.html)
            dom.innerHTML = node.attrs.html
            dom.contentEditable = "false"
            return { dom }
        }
    },
})

export default StatusEffectNode