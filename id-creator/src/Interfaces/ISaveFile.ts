import { IEgoInfo } from "./IEgoInfo";
import { IIdInfo } from "./IIdInfo";


export interface ISaveFile{
    saveName:string;
    saveTime:string;
    saveInfo:{
        idInfo:IIdInfo;
        egoInfo:IEgoInfo;
    }
}

export class SaveFile implements ISaveFile{
    saveName: string="New save file";
    saveTime: string= new Date().toLocaleString();
    saveInfo: { idInfo: IIdInfo; egoInfo: IEgoInfo; };
    public constructor(idInfo:IIdInfo,egoInfo:IEgoInfo){
        this.saveInfo.idInfo=idInfo
        this.saveInfo.egoInfo=egoInfo
    }
}