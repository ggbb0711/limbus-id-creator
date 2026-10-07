import { UserSummary } from "types/user/UserSummary"

export type UserSessionProfileDTO = UserSummary

export interface AuthResponseDTO {
    accessToken: string
    userSessionProfile: UserSessionProfileDTO
}
