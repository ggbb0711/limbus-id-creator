import { IPostDisplayCard } from "./IPostDisplayCard"

export interface IPostList<T = IPostDisplayCard> {
    list: T[]
    total: number
}
