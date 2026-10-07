import React, { ReactElement, ReactNode } from "react"
import { Editor, useEditorState } from "@tiptap/react"

type Format = "bold" | "italic" | "underline" | "bulletList" | "orderedList"

const BUTTONS: { format: Format, label: string, icon: ReactNode, run: (editor: Editor) => void }[] = [
    { format: "bold", label: "Bold", icon: <b>B</b>, run: editor => editor.chain().focus().toggleBold().run() },
    { format: "italic", label: "Italic", icon: <i>I</i>, run: editor => editor.chain().focus().toggleItalic().run() },
    { format: "underline", label: "Underline", icon: <u>U</u>, run: editor => editor.chain().focus().toggleUnderline().run() },
    { format: "bulletList", label: "Bulleted list", icon: "•", run: editor => editor.chain().focus().toggleBulletList().run() },
    { format: "orderedList", label: "Numbered list", icon: "1.", run: editor => editor.chain().focus().toggleOrderedList().run() },
]

export default function RichTextToolbar({ editor }: { editor: Editor | null }): ReactElement | null {
    const active = useEditorState({
        editor,
        selector: ({ editor }) => Object.fromEntries(BUTTONS.map(({ format }) => [format, editor?.isActive(format) ?? false])) as Record<Format, boolean>,
    })

    if (!editor || !active) return null

    return <div className="rich-text-toolbar" role="toolbar" aria-label="Formatting">
        {BUTTONS.map(({ format, label, icon, run }) =>
            <button key={format} type="button" className={`rich-text-toolbar-btn ${active[format] ? "is-active" : ""}`} aria-label={label} title={label} aria-pressed={active[format]}
                onMouseDown={(e) => {
                    e.preventDefault()
                    run(editor)
                }}>
                {icon}
            </button>
        )}
    </div>
}
