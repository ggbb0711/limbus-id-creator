import 'server-only'
import React from 'react'
import { ImageResponse } from 'next/og'
import { getUser } from 'features/user/api/server/users'
import UserSocialCard from 'features/user/components/userSocialCard/UserSocialCard'
import { loadSiteIcon, loadSocialImage } from 'utils/loadSocialImage'
import { SOCIAL_CARD_SIZE } from 'utils/socialCard'
import { SocialCardFrame } from 'components/socialCard/SocialCard'

export const userSocialImageAlt = 'Profile preview from Limbus ID Creator'

export async function renderUserSocialImage(userId: string): Promise<ImageResponse> {
    const [user, siteIcon] = await Promise.all([getUser(userId), loadSiteIcon()])
    if (!user) {
        return new ImageResponse(<SocialCardFrame siteIcon={siteIcon}><div style={{ display: 'flex', fontSize: 64 }}>User not found</div></SocialCardFrame>, SOCIAL_CARD_SIZE)
    }
    const avatar = await loadSocialImage(user.userIcon)
    return new ImageResponse(<UserSocialCard user={user} avatar={avatar} siteIcon={siteIcon} />, SOCIAL_CARD_SIZE)
}
