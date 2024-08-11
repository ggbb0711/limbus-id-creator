import uuid from "react-uuid";
import { IEgoInfo } from "./IEgoInfo";
import { IIdInfo } from "./IIdInfo";
import IUID from "./IUID";


export interface ISaveFile<info>{
    saveName:string;
    saveTime:string;
    saveInfo:info;
    previewImg?:string;//This is optional because some user may not have this property in their local storage
    id:string
}

export class SaveFile<info> implements ISaveFile<info>{
    id:string;
    saveName: string="New save file";
    saveTime: string= new Date().toLocaleString();
    saveInfo: info;
    previewImg: string="";
    public constructor(saveInfo:info,saveName:string,previewImg?:string,tags?:string[]){
        this.saveInfo = saveInfo
        this.saveName = saveName
        this.previewImg=previewImg||''
        this.id = uuid()
    }
}