
export interface IUserProfile{
    id:string,
    userEmail:string,
    userName:string,
    userIcon:string,
    createdAt:string
    owned:boolean
}

export class UserProfileRes implements IUserProfile{
    id:string;
    userEmail:string;
    userIcon:string;
    userName:string;
    createdAt:string;
    owned:boolean
    public constructor(id:string,userEmail:string,userIcon:string,userName:string,createdAt:string,owned:boolean){
        this.id = id
        this.userEmail = userEmail
        this.userIcon = userIcon
        this.userName = userName
        this.createdAt = createdAt
        this.owned = owned
    }
}