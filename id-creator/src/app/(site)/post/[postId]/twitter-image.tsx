import { renderPostSocialImage, postSocialImageAlt } from "features/post/api/server/PostSocialImage";
import { SOCIAL_CARD_CONTENT_TYPE, SOCIAL_CARD_SIZE } from "utils/socialCard";

export const alt = postSocialImageAlt
export const size = SOCIAL_CARD_SIZE
export const contentType = SOCIAL_CARD_CONTENT_TYPE
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params
    return renderPostSocialImage(postId)
}
