import React, { ReactElement, Ref } from "react";
import { ClassNames, ReactTags, ReactTagsAPI, Tag } from "react-tag-autocomplete";
import { canAddTag } from "utils/canAddTag";
import { TraitTagValue } from "features/cardCreator/types/IIdInfo";
import TraitTag from "./TraitTag";

const classNames: ClassNames = {
    root: "input stat-page-input-border trait-input",
    rootIsActive: "is-active",
    rootIsDisabled: "is-disabled",
    rootIsInvalid: "is-invalid",
    label: "visually-hidden",
    tagList: "trait-tag-list",
    tagListItem: "trait-tag-list-item",
    tag: "trait-tab",
    tagName: "trait-tab-name",
    comboBox: "trait-combobox",
    input: "trait-text-input",
    listBox: "trait-listbox",
    option: "trait-listbox-option",
    optionIsActive: "is-active",
    highlight: "trait-listbox-highlight",
}

export default function TraitInput({id,value,onChange,maxTags,placeholder,apiRef}:{
    id: string,
    value: TraitTagValue[],
    onChange: (tags: TraitTagValue[]) => void,
    maxTags: number,
    placeholder?: string,
    apiRef?: Ref<ReactTagsAPI>,
}):ReactElement{
    const selected: Tag[] = value.map(trait => ({ value: trait.value, label: trait.value }))

    function handleValidate(text: string){
        return canAddTag(value.map(trait => trait.value), text.trim(), maxTags)
    }

    function handleAdd(tag: Tag){
        const trimmed = tag.label.trim()
        if(!handleValidate(trimmed)) return
        onChange([...value, { value: trimmed, crossed: false }])
    }

    function handleDelete(index: number){
        onChange(value.filter((_, i) => i !== index))
    }

    function toggleCrossed(traitValue: string){
        onChange(value.map(trait => trait.value === traitValue ? { ...trait, crossed: !trait.crossed } : trait))
    }

    return <ReactTags
        ref={apiRef}
        id={id}
        labelText="Traits"
        selected={selected}
        suggestions={[]}
        allowNew
        activateFirstOption
        delimiterKeys={["Enter"]}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onValidate={handleValidate}
        placeholderText={placeholder}
        renderListBox={()=><></>}
        classNames={classNames}
        renderTag={({ tag, classNames, onClick, "aria-disabled": disabled }) => {
            const trait = value.find(t => t.value === tag.label) ?? { value: tag.label, crossed: false }
            return <TraitTag className={classNames.tag} trait={trait} disabled={disabled === true}
                updateCrossedTag={() => toggleCrossed(trait.value)} removeTag={onClick}/>
        }}
    />
}
