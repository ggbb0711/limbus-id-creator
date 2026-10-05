export interface ISaveFile<T> {
    id: string
    name: string
    saveTime: string
    updateTime: string
    saveInfo: T
    previewImg?: string
}
