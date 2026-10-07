'use client'
import React, { ReactElement, useEffect, useRef } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import RichTextToolbar from "./RichTextToolbar"
import "./RichTextEditor.css"

interface RichTextEditorProps {
    id: string
    label: string
    value: string
    onChange: (html: string) => void
    toolbar?: boolean
    className?: string
}

export default function RichTextEditor({ id, label, value, onChange, toolbar = false, className = "" }: RichTextEditorProps): ReactElement {
    const onChangeRef = useRef(onChange)

    useEffect(() => {
        onChangeRef.current = onChange
    })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit.configure({ link: false })],
        content: value,
        editorProps: {
            attributes: { id, role: "textbox", "aria-multiline": "true", "aria-label": label, class: "rich-text-editor-content" },
        },
        onUpdate: ({ editor }) => onChangeRef.current(editor.isEmpty ? "" : editor.getHTML()),
    })

    useEffect(() => {
        if (!editor || editor.isDestroyed) return
        const current = editor.isEmpty ? "" : editor.getHTML()
        if (value !== current) editor.commands.setContent(value, { emitUpdate: false })
    }, [editor, value])

    return <div className={`rich-text-editor input ${className}`}>
        {toolbar && <RichTextToolbar editor={editor}/>}
        <EditorContent editor={editor}/>
    </div>
}
