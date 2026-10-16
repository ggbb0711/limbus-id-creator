import 'server-only'
import React from 'react'
import { ImageResponse } from 'next/og'
import { getPost } from 'features/post/api/server/posts'
import PostSocialCard from 'features/post/components/postSocialCard/PostSocialCard'
import { loadSiteIcon, loadSocialImage } from 'components/socialCard/loadSocialImage'
import { SOCIAL_CARD_SIZE } from 'components/socialCard/socialCardUtils'
import { SocialCardFrame } from 'components/socialCard/SocialCard'
import { isUnavailable } from 'api/server/serverFetch'
import { getUnavailableContent } from 'components/unavailablePage/unavailableContent'

export const postSocialImageAlt = 'Post preview from Limbus ID Creator'

export async function renderPostSocialImage(postId: string): Promise<ImageResponse> {
    const [post, siteIcon] = await Promise.all([getPost(postId), loadSiteIcon()])
    if (!post || isUnavailable(post)) {
        const text = post ? getUnavailableContent(post.code).title : 'Post not found'
        return new ImageResponse(<SocialCardFrame siteIcon={siteIcon}><div style={{ display: 'flex', fontSize: 64 }}>{text}</div></SocialCardFrame>, SOCIAL_CARD_SIZE)
    }
    const [image, avatar] = await Promise.all([loadSocialImage(post.imagesAttach[0]), loadSocialImage(post.userIcon)])
    return new ImageResponse(<PostSocialCard post={post} image={image} avatar={avatar} siteIcon={siteIcon} />, SOCIAL_CARD_SIZE)
}
