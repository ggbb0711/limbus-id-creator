import { IPost } from "features/post/types/IPost"
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard"

export function toPostDisplayCard(post: IPost): IPostDisplayCard {
    const { imagesAttach, ...rest } = post
    const card: IPostDisplayCard & Partial<Pick<IPost, "description">> = { ...rest, cardImg: imagesAttach[0] ?? "" }
    delete card.description
    return card
}
