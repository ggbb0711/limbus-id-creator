import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StatusEffectNode from './StatusEffectNode'

function load(content: string) {
    const editor = new Editor({ extensions: [Document, Paragraph, Text, StatusEffectNode], content })
    const nodes: string[] = []
    editor.state.doc.descendants(node => {
        if (node.type.name === 'statusEffect') nodes.push(node.attrs.html)
    })
    const html = editor.getHTML()
    editor.destroy()
    return { nodes, html }
}

describe('StatusEffectNode', () => {
    it('sanitizes html loaded from a data-status-effect attribute', () => {
        const { nodes, html } = load('<p><span data-status-effect="&lt;img src=x onerror=alert(1)&gt;Burn">Burn</span></p>')
        expect(nodes).toHaveLength(1)
        expect(nodes[0]).not.toContain('onerror')
        expect(nodes[0]).toContain('Burn')
        expect(html).not.toContain('onerror')
    })

    it('sanitizes pasted non-editable spans', () => {
        const { nodes } = load('<p><span contenteditable="false" onclick="alert(1)">Bleed<script>alert(1)</script></span></p>')
        expect(nodes).toHaveLength(1)
        expect(nodes[0]).not.toMatch(/onclick|script/)
        expect(nodes[0]).toContain('Bleed')
    })

    it('keeps safe status markup', () => {
        const status = "<span class='center-element' contenteditable='false' style='color:red;'><img class='status-icon' src='/Images/status-effect/Burn.webp' alt='burn' />Burn</span>"
        const { nodes } = load(`<p>${status}</p>`)
        expect(nodes[0]).toContain('src="/Images/status-effect/Burn.webp"')
        expect(nodes[0]).toContain('contenteditable="false"')
    })
})
