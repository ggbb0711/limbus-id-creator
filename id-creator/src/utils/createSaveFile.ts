import uuid from "react-uuid"
import { ISaveFile } from "types/ISaveFile"
import formatDateForBackend from "utils/formatDateForBackend"

export function createSaveFile<T>(saveInfo: T, name: string, previewImg = ""): ISaveFile<T> {
    const now = formatDateForBackend(new Date())
    return { id: uuid(), name, saveTime: now, updateTime: now, saveInfo, previewImg }
}
