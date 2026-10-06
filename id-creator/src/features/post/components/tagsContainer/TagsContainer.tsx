import React from "react";
import { ReactElement } from "react";
import { ITag } from "features/post/utils/TagList";
import "./TagsContainer.css"
import CloseIcon from "assets/icons/CloseIcon";
import TagChip from "features/post/components/tagChip/TagChip";

export default function TagsContainer({tags,customClass="",deleteTag}:{tags:ITag[],customClass?:string,deleteTag:(i:number)=>void}):ReactElement{
    return <div className={`tags-container  ${customClass}`}>
        
        {tags.map((tag:ITag,i)=><TagChip key={i} tag={tag} className="keyword-tag" iconClassName="status-icon" iconSize={15}>
            <span className="tag-close-icon" onClick={()=>deleteTag(i)}><CloseIcon></CloseIcon></span>
        </TagChip>)}
    </div>
}