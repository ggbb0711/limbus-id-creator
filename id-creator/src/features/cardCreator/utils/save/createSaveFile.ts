import uuid from "react-uuid"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"

export function createSaveFile<T>(saveInfo: T, name: string, previewImg = ""): ISaveFile<T> {
    const now = new Date().toISOString()
    return { id: uuid(), name, saveTime: now, updateTime: now, saveInfo, previewImg }
}
