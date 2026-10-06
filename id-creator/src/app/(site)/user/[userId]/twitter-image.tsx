import { renderUserSocialImage, userSocialImageAlt } from "features/user/api/server/UserSocialImage";
import { SOCIAL_CARD_CONTENT_TYPE, SOCIAL_CARD_SIZE } from "components/socialCard/socialCardUtils";

export const alt = userSocialImageAlt
export const size = SOCIAL_CARD_SIZE
export const contentType = SOCIAL_CARD_CONTENT_TYPE
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    return renderUserSocialImage(userId)
}
