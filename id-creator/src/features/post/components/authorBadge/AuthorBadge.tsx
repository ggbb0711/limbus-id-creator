import React, { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import "features/post/components/shared/Style.css";

interface AuthorBadgeProps {
    userId: string
    userName: string
    userIcon: string
    size: number
    iconClassName: string
}

export default function AuthorBadge({ userId, userName, userIcon, size, iconClassName }: AuthorBadgeProps): ReactElement {
    return <Link prefetch={false} href={`/user/${userId}`} className="center-element">
        <Image className={iconClassName} src={userIcon} alt="" width={size} height={size} />
        <span className="post-author-name">{userName}</span>
    </Link>
}
