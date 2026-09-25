

export interface IUserChangeResponse{
    userName:string
    userIcon:string
}

export class UserChangeResponse implements IUserChangeResponse{
    userName: string
    userIcon: string
    public constructor(userName:string,userIcon:string) {
        this.userName = userName
        this.userIcon = userIcon
    }
}