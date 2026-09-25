

export interface IUserChangeRequest{
    userName:string
    userIcon:string|File
}

export class UserChangeRequest implements IUserChangeRequest{
    userName: string
    userIcon: string|File
    public constructor(userName:string,userIcon:string|File) {
        this.userName = userName
        this.userIcon = userIcon
    }
}