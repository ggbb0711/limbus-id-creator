import { appConfig } from "config/env.client";
import getImageDimensions from 'features/cardCreator/utils/image/getImageDimensions'

export async function compressAndReadImage(file: File): Promise<string> {
    const [{ default: imageCompression }, { width }] = await Promise.all([
        import('browser-image-compression'),
        getImageDimensions(file),
    ])
    const compressedFile = await imageCompression(file, {
        maxSizeMB: appConfig.image.compressMaxSizeMB,
        useWebWorker: true,
        maxWidthOrHeight: Math.max(appConfig.image.compressMinDimension, Math.floor(width * (2 / 3)))
    })

    return new Promise<string>((resolve, reject) => {
        const fr = new FileReader()
        fr.readAsDataURL(compressedFile)
        fr.addEventListener("load", () => {
            resolve(fr.result as string)
        })
        fr.addEventListener("error", () => {
            reject(new Error("Failed to read file"))
        })
    })
}
