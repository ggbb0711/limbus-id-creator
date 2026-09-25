export interface UserSessionProfileDTO {
    id:string,
    userEmail:string,
    userName:string,
    userIcon:string
}

export interface AuthResponseDTO {
    accessToken:string,
    userSessionProfile:UserSessionProfileDTO
}
