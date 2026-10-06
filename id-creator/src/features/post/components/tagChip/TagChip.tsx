import React, { ReactElement, ReactNode } from "react";
import Image from "next/image";
import { ITag } from "features/post/utils/TagList";

interface TagChipProps {
    tag?: ITag
    className: string
    iconClassName: string
    iconSize: number
    onClick?: () => void
    children?: ReactNode
}

export default function TagChip({ tag, className, iconClassName, iconSize, onClick, children }: TagChipProps): ReactElement {
    return <div className={className} onClick={onClick}>
        {tag?.icon && <Image className={iconClassName} src={tag.icon} alt={`${tag.tagName}_icon`} width={iconSize} height={iconSize} />}
        <p>{tag?.tagName}</p>
        {children}
    </div>
}
