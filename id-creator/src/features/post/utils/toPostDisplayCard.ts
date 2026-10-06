import { IPost } from "features/post/types/IPost"
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard"

export const toPostDisplayCard = ({ id, title, imagesAttach, userIcon, userName, userId, created, tags, viewCount, commentCount }: IPost): IPostDisplayCard => ({
    id,
    title,
    cardImg: imagesAttach[0] ?? "",
    userIcon,
    userName,
    userId,
    created,
    tags,
    viewCount,
    commentCount,
})
