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

export function validateNewPost({ title, saves }: { title: string, saves: readonly ChosenSave[] }, { maxTitleLength, maxImages }: NewPostLimits): string | null {
    const trimmed = title.trim()
    if (trimmed.length < 1 || trimmed.length > maxTitleLength) return `Post name length must be between 1 and ${maxTitleLength}`
    if (saves.length < 1 || saves.length > maxImages) return `Post must have between 1 and ${maxImages} images`
    return null
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
