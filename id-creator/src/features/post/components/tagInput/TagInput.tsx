'use client'
import React, { ReactElement, useMemo, useRef, useState } from "react";
import { ITag, filterTags } from "features/post/utils/TagList";
import "./TagInput.css"
import TagChip from "features/post/components/tagChip/TagChip";
import { useCombobox } from "hooks/useCombobox";

interface TagInputProps {
    completeFn: (tag: ITag) => void
    maxTag: number
    selectedCount: number
    customClass?: string
    id: string
}

export default function TagInput({ completeFn, maxTag, selectedCount, customClass = "", id }: TagInputProps): ReactElement {
    const [text, setText] = useState("")
    const tags = useMemo(() => filterTags(text), [text])
    const containerRef = useRef<HTMLDivElement>(null)
    const combobox = useCombobox({
        containerRef,
        items: tags,
        onSelect: (tag: ITag) => {
            if (selectedCount >= maxTag) return
            completeFn(tag)
            setText("")
        },
    })

    return <div ref={containerRef} className="tag-input-container">
        <input type="text" id={id} className={`tag-input ${customClass}`} placeholder="Add tag" value={text}
            {...combobox.inputProps}
            onChange={(e) => {
                setText(e.target.value)
                combobox.open()
            }}
            autoComplete="off"/>
        <div className="found-tag-outer-container">
            <div className="found-tag-container" {...combobox.listProps}>
                {combobox.isOpen && tags.map((tag, i) =>
                    <TagChip key={tag.tagName} tag={tag} className={`found-tag center-element ${combobox.activeIndex === i ? "active" : ""}`}
                        iconClassName="status-icon" iconSize={15} {...combobox.getOptionProps(i)}/>
                )}
            </div>
        </div>
    </div>
}
