import { z } from "zod"
import { SaveMode } from "features/cardCreator"
import { ITag } from "./TagList"

export const POST_SAVE_KINDS = ["Identity", "Ego"] as const
export type PostSaveKind = typeof POST_SAVE_KINDS[number]

export interface ChosenSave {
    previewUrl: string
    kind: PostSaveKind
}

export const SAVE_MODE_BY_KIND: Record<PostSaveKind, SaveMode> = { Identity: "ID", Ego: "EGO" }

export interface NewPostLimits {
    maxTitleLength: number
    maxImages: number
    maxUserTags: number
}

const newPostSchema = ({ maxTitleLength, maxImages }: NewPostLimits) => {
    const titleMessage = `Post name length must be between 1 and ${maxTitleLength}`
    const imagesMessage = `Post must have between 1 and ${maxImages} images`
    return z.object({
        title: z.string().trim().min(1, titleMessage).max(maxTitleLength, titleMessage),
        saves: z.array(z.unknown()).min(1, imagesMessage).max(maxImages, imagesMessage),
    })
}

export function validateNewPost(post: { title: string, saves: readonly ChosenSave[] }, limits: NewPostLimits): string | null {
    const result = newPostSchema(limits).safeParse(post)
    return result.success ? null : result.error.issues[0].message
}

export type UploadTagsResult = { tags: string[] } | { error: string }

export function buildUploadTags(tags: readonly ITag[], saves: readonly ChosenSave[], maxUserTags: number): UploadTagsResult {
    const names = [...new Set(tags.map(tag => tag.tagName))]
    POST_SAVE_KINDS.forEach(kind => {
        if (saves.some(save => save.kind === kind) && !names.includes(kind)) names.push(kind)
    })
    const maxTotal = maxUserTags + 1
    if (names.length > maxTotal) return { error: `Post cannot have more than ${maxTotal} tags (including the Identity/Ego tag)` }
    return { tags: names }
}

export function addChosenSave(saves: readonly ChosenSave[], save: ChosenSave, maxImages: number): readonly ChosenSave[] {
    if (saves.length >= maxImages || saves.some(existing => existing.previewUrl === save.previewUrl)) return saves
    return [...saves, save]
}
