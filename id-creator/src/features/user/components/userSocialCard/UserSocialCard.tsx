import React, { ReactElement } from "react"
import { SocialCardFrame, SocialCardImage } from "components/socialCard/SocialCard"
import { IUserProfile } from "features/user/types/IUserProfile"
import formatDisplayDate from "utils/formatDisplayDate"
import { SOCIAL_CARD_COLORS, truncateText } from "components/socialCard/socialCardUtils"

interface UserSocialCardProps {
    user: Pick<IUserProfile, "userName" | "createdAt">
    avatar: string | null
    siteIcon: string | null
}

export default function UserSocialCard({ user, avatar, siteIcon }: UserSocialCardProps): ReactElement {
    return <SocialCardFrame siteIcon={siteIcon}>
        {avatar && <SocialCardImage src={avatar} width={400} height={400} round />}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24, justifyContent: "center" }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>{truncateText(user.userName, 40)}</div>
            <div style={{ display: "flex" }}>Custom Limbus Company Identities and E.G.Os</div>
            <div style={{ display: "flex", color: SOCIAL_CARD_COLORS.muted, fontSize: 26 }}>
                {`Joined ${formatDisplayDate(user.createdAt)}`}
            </div>
        </div>
    </SocialCardFrame>
}
