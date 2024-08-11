

export interface ILoginUser{
    id:string,
    userEmail:string,
    userName:string,
    userIcon:string   
}

export class LoginUser implements ILoginUser{
    id:string;
    userEmail:string;
    userIcon:string;
    userName:string;
    public constructor(id:string,userEmail:string,userIcon:string,userName:string){
        this.id = id
        this.userEmail = userEmail
        this.userIcon = userIcon
        this.userName = userName
    }
}