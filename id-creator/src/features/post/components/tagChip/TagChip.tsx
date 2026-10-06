import React, { HTMLAttributes, ReactElement, ReactNode } from "react";
import Image from "next/image";
import { ITag } from "features/post/utils/TagList";

interface TagChipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    tag?: ITag
    className: string
    iconClassName: string
    iconSize: number
    children?: ReactNode
}

export default function TagChip({ tag, className, iconClassName, iconSize, children, ...props }: TagChipProps): ReactElement {
    return <div {...props} className={className}>
        {tag?.icon && <Image className={iconClassName} src={tag.icon} alt="" width={iconSize} height={iconSize} />}
        <p>{tag?.tagName}</p>
        {children}
    </div>
}
