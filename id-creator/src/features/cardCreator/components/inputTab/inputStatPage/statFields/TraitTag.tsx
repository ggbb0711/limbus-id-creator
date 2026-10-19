import React, { MouseEventHandler, ReactElement } from "react";
import CloseIcon from "assets/icons/CloseIcon";
import { TraitTagValue } from "features/cardCreator/types/IIdInfo";

export default function TraitTag({trait,updateCrossedTag,removeTag,className,disabled}:{
    trait: TraitTagValue,
    updateCrossedTag: ()=>void,
    removeTag?: MouseEventHandler<HTMLButtonElement>,
    className?: string,
    disabled?: boolean,
}): ReactElement{
    return <span className={`${className ?? ""} ${trait.crossed?"crossed":""}`}>
        <button type="button" className="trait-tab-name" aria-pressed={trait.crossed} title={`Cross out ${trait.value}`} disabled={disabled} onClick={updateCrossedTag}>{trait.value}</button>
        <button type="button" className="trait-tab-remove" aria-label={`Remove ${trait.value}`} title={`Remove ${trait.value}`} disabled={disabled} onClick={removeTag}><CloseIcon/></button>
    </span>
}
