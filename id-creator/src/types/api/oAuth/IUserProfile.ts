import { UserSummary } from "types/api/user/UserSummary"

export interface IUserProfile extends UserSummary {
    createdAt: string
    owned: boolean
}
