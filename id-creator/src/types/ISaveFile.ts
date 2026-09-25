import uuid from "react-uuid";
import formatDateForBackend from "utils/formatDateForBackend";


export interface ISaveFile<info>{
    name:string;
    saveTime: string;
    updateTime: string;
    saveInfo:info;
    previewImg?:string;//This is optional because some user may not have this property in their local storage
    id:string
}

export class SaveFile<info> implements ISaveFile<info>{
    id:string;
    name: string="New save file";
    saveTime: string = formatDateForBackend(new Date());
    updateTime: string = formatDateForBackend(new Date());
    saveInfo: info;
    previewImg: string="";
    public constructor(saveInfo:info,name:string,previewImg?:string){
        this.saveInfo = saveInfo
        this.name = name
        this.previewImg=previewImg||''
        this.id = uuid()
    }
}