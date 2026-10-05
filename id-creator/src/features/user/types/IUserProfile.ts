import { UserSummary } from "types/user/UserSummary"

export interface IUserProfile extends UserSummary {
    createdAt: string
    owned: boolean
}
