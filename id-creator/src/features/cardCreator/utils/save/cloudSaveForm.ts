import { ICardInfoBase } from "features/cardCreator/types/ICardInfoBase"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import { clearSkillImage, readSkillImage } from "features/cardCreator/skills/skillData"
import checkBase64Image from "features/cardCreator/utils/image/checkBase64Image"

export type Base64Target =
    | { kind: "sinnerIcon" }
    | { kind: "splashArt" }
    | { kind: "skill"; index: number }

export interface Base64Image {
    dataUrl: string
    target: Base64Target
}

export interface CollectedImages<T> {
    images: Base64Image[]
    stripped: T
}

export interface UploadFile {
    target: Base64Target
    file: Blob
}

export function collectBase64Images<T extends ICardInfoBase>(info: T): CollectedImages<T> {
    const images: Base64Image[] = []
    const stripped: T = { ...info }

    if (checkBase64Image(info.sinnerIcon)) {
        images.push({ dataUrl: info.sinnerIcon, target: { kind: "sinnerIcon" } })
        stripped.sinnerIcon = ""
    }
    if (checkBase64Image(info.splashArt)) {
        images.push({ dataUrl: info.splashArt, target: { kind: "splashArt" } })
        stripped.splashArt = ""
    }

    stripped.skillDetails = info.skillDetails.map((skill, index) => {
        const image = readSkillImage(skill)
        if (!image || !checkBase64Image(image)) return { ...skill, index }
        images.push({ dataUrl: image, target: { kind: "skill", index } })
        return { ...clearSkillImage(skill), index }
    })

    return { images, stripped }
}

export function buildSaveFormData<T>(saveData: ISaveFile<T>, thumbnail: Blob, files: readonly UploadFile[]): FormData {
    const form = new FormData()
    const sinnerIcon = files.find(f => f.target.kind === "sinnerIcon")
    const splashArt = files.find(f => f.target.kind === "splashArt")
    if (sinnerIcon) form.append("sinnerIcon", sinnerIcon.file)
    if (splashArt) form.append("splashArtImg", splashArt.file)
    form.append("thumbnailImage", thumbnail)

    let position = 0
    files.forEach(({ target, file }) => {
        if (target.kind !== "skill") return
        form.append(`SkillImages[${position}].Image`, file)
        form.append(`SkillImages[${position}].Index`, target.index.toString())
        position++
    })

    form.append("SaveData", JSON.stringify(saveData))
    return form
}

export function describeImageTarget(target: Base64Target): string {
    switch (target.kind) {
        case "sinnerIcon":
            return "Sinner icon"
        case "splashArt":
            return "Splash art"
        case "skill":
            return `Skill ${target.index + 1} image`
    }
}
