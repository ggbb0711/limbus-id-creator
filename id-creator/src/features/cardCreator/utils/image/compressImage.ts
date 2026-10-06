import { appConfig } from "config/env.client"
import getImageDimensions from "features/cardCreator/utils/image/getImageDimensions"

interface CompressOptions {
    webp?: boolean
    resize?: boolean
}

const loadImageCompression = async () => (await import("browser-image-compression")).default

export const scaledMaxDimension = (width: number) =>
    Math.max(appConfig.image.compressMinDimension, Math.floor(width * (2 / 3)))

export async function compressImage(file: File, { webp = false, resize = false }: CompressOptions = {}): Promise<File> {
    const [imageCompression, maxWidthOrHeight] = await Promise.all([
        loadImageCompression(),
        resize ? getImageDimensions(file).then(({ width }) => scaledMaxDimension(width)) : undefined,
    ])
    return imageCompression(file, {
        maxSizeMB: appConfig.image.compressMaxSizeMB,
        useWebWorker: true,
        ...(webp ? { fileType: "image/webp", initialQuality: appConfig.image.webpQuality } : {}),
        ...(maxWidthOrHeight ? { maxWidthOrHeight } : {}),
    })
}

export const dataUrlToFile = async (dataUrl: string): Promise<File> =>
    (await loadImageCompression()).getFilefromDataUrl(dataUrl, "image")

export const fileToDataUrl = async (file: File): Promise<string> =>
    (await loadImageCompression()).getDataUrlFromFile(file)

export const compressAndReadImage = async (file: File): Promise<string> =>
    fileToDataUrl(await compressImage(file, { resize: true }))
