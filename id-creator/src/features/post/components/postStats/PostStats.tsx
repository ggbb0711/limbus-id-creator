import React, { ReactElement } from "react";
import CommentIcon from "assets/icons/CommentIcon";
import ViewIcon from "assets/icons/ViewIcon";

interface PostStatsProps {
    viewCount: number
    commentCount: number
    itemClassName: string
    iconSize: number
}

export default function PostStats({ viewCount, commentCount, itemClassName, iconSize }: PostStatsProps): ReactElement {
    return <>
        <div className={itemClassName}>
            <ViewIcon width={iconSize} height={iconSize}/>
            {viewCount}
            <span className="visually-hidden"> views</span>
        </div>
        <div className={itemClassName}>
            <CommentIcon width={iconSize} height={iconSize}/>
            {commentCount}
            <span className="visually-hidden"> comments</span>
        </div>
    </>
}
