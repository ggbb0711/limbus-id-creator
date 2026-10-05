import { UserSummary } from "types/api/user/UserSummary"

export type UserSessionProfileDTO = UserSummary

export interface AuthResponseDTO {
    accessToken: string
    userSessionProfile: UserSessionProfileDTO
}
