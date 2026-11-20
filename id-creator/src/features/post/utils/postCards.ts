import { IEgoInfo, IIdInfo, migrateEgoInfo, migrateIdInfo } from "features/cardCreator"
import { IPost } from "features/post/types/IPost"

export type PostCardView =
    | { kind: "Identity", imageUrl: string, info: IIdInfo }
    | { kind: "Ego", imageUrl: string, info: IEgoInfo }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)

export function toPostCards(post: Pick<IPost, "cards">): PostCardView[] {
    return [...(post.cards ?? [])]
        .sort((a, b) => a.position - b.position)
        .flatMap((card): PostCardView[] => {
            if (!isRecord(card.saveInfo)) return []
            if (card.kind === "Identity") return [{ kind: "Identity", imageUrl: card.imageUrl, info: migrateIdInfo(card.saveInfo) }]
            if (card.kind === "Ego") return [{ kind: "Ego", imageUrl: card.imageUrl, info: migrateEgoInfo(card.saveInfo) }]
            return []
        })
}

export function matchCardsToImages<T extends { imageUrl: string }>(images: readonly string[], cards: readonly T[]): (T | null)[] {
    const remaining = [...cards]
    return images.map(image => {
        const index = remaining.findIndex(card => card.imageUrl === image)
        return index < 0 ? null : remaining.splice(index, 1)[0]
    })
}
