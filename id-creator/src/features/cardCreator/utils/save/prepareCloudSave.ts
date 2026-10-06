import { RefObject } from "react"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import { compressImage, dataUrlToFile } from "features/cardCreator/utils/image/compressImage"
import { UploadFile, buildSaveFormData, collectBase64Images, describeImageTarget } from "./cloudSaveForm"

export const CARD_PREVIEW_LABEL = "Card preview"

export class SaveImageError extends Error {
    override name = "SaveImageError"

    constructor(public readonly assets: string[], public readonly causes: unknown[]) {
        super(`Couldn't process: ${assets.join(", ")}`)
    }
}

async function createThumbnail(domRef: RefObject<HTMLElement | null>): Promise<Blob> {
    const { default: TurnRefToImg } = await import("features/cardCreator/utils/image/TurnRefToImg")
    return compressImage(await dataUrlToFile(await TurnRefToImg(domRef)), { webp: true, resize: true })
}

export async function prepareCloudSaveForm(saveFile: ISaveFile<CardInfo>, domRef: RefObject<HTMLElement | null>): Promise<FormData> {
    const saveData = { ...saveFile, saveTime: new Date().toISOString() }
    const { images, stripped } = collectBase64Images(saveData.saveInfo)

    const [thumbnail, ...compressed] = await Promise.allSettled([
        createThumbnail(domRef),
        ...images.map(async image => compressImage(await dataUrlToFile(image.dataUrl), { webp: true })),
    ])

    const failed: { label: string, reason: unknown }[] = []
    if (thumbnail.status === "rejected") failed.push({ label: CARD_PREVIEW_LABEL, reason: thumbnail.reason })
    const files: UploadFile[] = []
    compressed.forEach((result, i) => {
        if (result.status === "fulfilled") files.push({ target: images[i].target, file: result.value })
        else failed.push({ label: describeImageTarget(images[i].target), reason: result.reason })
    })

    if (failed.length > 0 || thumbnail.status === "rejected") {
        throw new SaveImageError(failed.map(f => f.label), failed.map(f => f.reason))
    }
    return buildSaveFormData({ ...saveData, saveInfo: stripped }, thumbnail.value, files)
}
