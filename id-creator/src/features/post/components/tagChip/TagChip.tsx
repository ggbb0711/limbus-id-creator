import React, { HTMLAttributes, ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ITag } from "features/post/utils/TagList";

interface TagChipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    tag?: ITag
    href?: string
    className: string
    iconClassName: string
    iconSize: number
    children?: ReactNode
}

export default function TagChip({ tag, href, className, iconClassName, iconSize, children, ...props }: TagChipProps): ReactElement {
    const content = <>
        {tag?.icon && <Image className={iconClassName} src={tag.icon} alt="" width={iconSize} height={iconSize} />}
        <p>{tag?.tagName}</p>
        {children}
    </>
    if (href) return <Link href={href} className={className}>{content}</Link>
    return <div {...props} className={className}>{content}</div>
}
