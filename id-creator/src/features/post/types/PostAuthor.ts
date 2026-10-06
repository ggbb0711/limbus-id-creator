import { UserSummary } from "types/user/UserSummary"

export type PostAuthor = { userId: UserSummary["id"] } & Pick<UserSummary, "userName" | "userIcon">
