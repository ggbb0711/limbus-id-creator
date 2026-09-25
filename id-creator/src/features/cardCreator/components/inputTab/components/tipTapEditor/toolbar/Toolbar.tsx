import React from "react"
import { Editor, useEditorState } from "@tiptap/react"
import "./Toolbar.css"

interface ToolbarProps {
    editor: Editor | null
}

export default function Toolbar({ editor }: ToolbarProps) {
    const state = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) return { bold: false, italic: false, underline: false, color: "#ffffff", fontSize: "" }
            return {
                bold: ctx.editor.isActive("bold"),
                italic: ctx.editor.isActive("italic"),
                underline: ctx.editor.isActive("underline"),
                color: ctx.editor.getAttributes("textStyle").color || "#ffffff",
                fontSize: ctx.editor.getAttributes("textStyle").fontSize || "",
            }
        },
    })

    if (!editor) return null

    return (
        <div className="tiptap-toolbar">
            <button
                type="button"
                className={`toolbar-btn ${state.bold ? "is-active" : ""}`}
                onMouseDown={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleBold().run()
                }}
            >
                <b>B</b>
            </button>
            <button
                type="button"
                className={`toolbar-btn ${state.italic ? "is-active" : ""}`}
                onMouseDown={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleItalic().run()
                }}
            >
                <i>I</i>
            </button>
            <button
                type="button"
                className={`toolbar-btn ${state.underline ? "is-active" : ""}`}
                onMouseDown={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleUnderline().run()
                }}
            >
                <u>U</u>
            </button>

            <span className="toolbar-separator" />

            <label className="toolbar-color-label" title="Text color">
                <input
                    type="color"
                    className="toolbar-color-input"
                    value={state.color}
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
            </label>
            <button
                type="button"
                className="toolbar-btn toolbar-btn-sm"
                onMouseDown={(e) => {
                    e.preventDefault()
                    editor.chain().focus().unsetColor().run()
                }}
                title="Reset color"
            >
                ✕
            </button>

            <span className="toolbar-separator" />

            <select
                className="toolbar-select"
                value={state.fontSize}
                onChange={(e) => {
                    const size = e.target.value
                    if (size) {
                        editor.chain().focus().setFontSize(size).run()
                    } else {
                        editor.chain().focus().unsetFontSize().run()
                    }
                }}
            >
                <option value="">Size</option>
                <option value="10px">10</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
            </select>
        </div>
    )
}