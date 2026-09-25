import uuid from "react-uuid";


export interface IAlert{
    status:string,
    msg:string,
    alertId:string
}

export class Alert implements IAlert{
    status: string;
    msg: string;
    alertId:string;

    public constructor(status:string,msg:string){
        this.status=status
        this.msg=msg
        this.alertId = uuid()
    }
}