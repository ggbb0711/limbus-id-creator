import { IPost } from "./IPost"

export type IPostDisplayCard = Omit<IPost, "imagesAttach" | "description"> & { cardImg: string }
