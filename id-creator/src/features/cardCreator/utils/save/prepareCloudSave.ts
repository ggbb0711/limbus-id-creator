import { RefObject } from "react"
import imageCompression from "browser-image-compression"
import { appConfig } from "config/env.client"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import base64ToFile from "features/cardCreator/utils/image/base64ToFile"
import getImageDimensions from "features/cardCreator/utils/image/getImageDimensions"
import formatDateForBackend from "./formatDateForBackend"
import { UploadFile, buildSaveFormData, collectBase64Images, describeImageTarget } from "./cloudSaveForm"

export const CARD_PREVIEW_LABEL = "Card preview"

export class SaveImageError extends Error {
    override name = "SaveImageError"

    constructor(public readonly assets: string[], public readonly causes: unknown[]) {
        super(`Couldn't process: ${assets.join(", ")}`)
    }
}

const compressToWebP = (file: File, maxWidthOrHeight?: number) => imageCompression(file, {
    maxSizeMB: appConfig.image.compressMaxSizeMB,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: appConfig.image.webpQuality,
    ...(maxWidthOrHeight ? { maxWidthOrHeight } : {}),
})

async function createThumbnail(domRef: RefObject<HTMLElement | null>): Promise<Blob> {
    const { default: TurnRefToImg } = await import("features/cardCreator/utils/image/TurnRefToImg")
    const thumbnailFile = base64ToFile(await TurnRefToImg(domRef), "new file")
    const { width } = await getImageDimensions(thumbnailFile)
    return compressToWebP(thumbnailFile, Math.max(appConfig.image.compressMinDimension, Math.floor(width * (2 / 3))))
}

export async function prepareCloudSaveForm(saveFile: ISaveFile<CardInfo>, domRef: RefObject<HTMLElement | null>): Promise<FormData> {
    const saveData = { ...saveFile, saveTime: formatDateForBackend(new Date()) }
    const { images, stripped } = collectBase64Images(saveData.saveInfo)

    const [thumbnail, ...compressed] = await Promise.allSettled([
        createThumbnail(domRef),
        ...images.map(image => compressToWebP(base64ToFile(image.dataUrl, "new file"))),
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
