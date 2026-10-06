import React, { ReactElement } from "react"
import { SocialCardChips, SocialCardFrame, SocialCardImage } from "components/socialCard/SocialCard"
import { IPost } from "features/post/types/IPost"
import { getTag } from "features/post/utils/TagList"
import formatDisplayDate from "utils/formatDisplayDate"
import { SOCIAL_CARD_COLORS, truncateText } from "components/socialCard/socialCardUtils"

interface PostSocialCardProps {
    post: IPost
    image: string | null
    avatar: string | null
    siteIcon: string | null
}

export const MAX_CARD_TAGS = 4

export default function PostSocialCard({ post, image, avatar, siteIcon }: PostSocialCardProps): ReactElement {
    const tags = post.tags.slice(0, MAX_CARD_TAGS).map(tag => getTag(tag)?.tagName ?? tag)
    return <SocialCardFrame siteIcon={siteIcon}>
        {image && <SocialCardImage src={image} width={480} height={480} />}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24, justifyContent: "center" }}>
            <div style={{ display: "flex", fontSize: image ? 56 : 72, fontWeight: 700, lineHeight: 1.15 }}>
                {truncateText(post.title, image ? 80 : 110)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {avatar && <SocialCardImage src={avatar} width={64} height={64} round />}
                <span>by {truncateText(post.userName, 40)}</span>
            </div>
            <SocialCardChips items={tags} />
            <div style={{ display: "flex", color: SOCIAL_CARD_COLORS.muted, fontSize: 26 }}>
                {`${formatDisplayDate(post.created)} · ${post.viewCount} views · ${post.commentCount} comments`}
            </div>
        </div>
    </SocialCardFrame>
}
