import { Extension } from "@tiptap/core"
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion"

export interface KeywordSuggestionOptions {
    suggestion: Omit<SuggestionOptions, "editor">
}

const KeywordSuggestion = Extension.create<KeywordSuggestionOptions>({
    name: "keywordSuggestion",

    addOptions() {
        return {
            suggestion: {
                char: "[",
                allowSpaces: false,
                startOfLine: false,
                command: ({ editor, range, props }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent(props.html + " ")
                        .run()
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export default KeywordSuggestion
