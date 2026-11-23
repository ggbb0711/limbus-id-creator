export interface ILinkedPost {
    id: string
    title: string
}

export interface ISaveFile<T> {
    id: string
    name: string
    saveTime: string
    updateTime: string
    saveInfo: T
    previewImg?: string
    linkedPosts?: ILinkedPost[]
}

export interface ISaveList<T> {
    list: ISaveFile<T>[]
    total: number
}
