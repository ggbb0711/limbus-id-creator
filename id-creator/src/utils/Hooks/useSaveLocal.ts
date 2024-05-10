import { ISaveFile } from "Interfaces/ISaveFile";
import { useCallback, useEffect, useState } from "react";


export default function useSaveLocal<SaveObj>(LocalSaveDataName:string){
    const [saveData,setSaveData] = useState<ISaveFile<SaveObj>[]>([]) 

    const changeSaveName=useCallback((index:number,newName:string)=>{
        const newSaveData = [...saveData]
        newSaveData[index].saveName=newName
        setSaveData(newSaveData)
        localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
    },[saveData])

    const deleteSave = useCallback((index:number)=>{
        const newSaveData = [...saveData]
        newSaveData.splice(index,1)
        setSaveData(newSaveData)
        localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
    },[saveData])

    const createSave = useCallback((saveObj: ISaveFile<SaveObj>)=>{
        const newSaveData = [...saveData]
        newSaveData.unshift(saveObj)
        setSaveData(newSaveData)
        localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
    },[saveData])

    const loadSave = useCallback((index: number)=>{
        return saveData[index]
    },[saveData])

    const overwriteSave = useCallback((index: number,saveObj:ISaveFile<SaveObj>)=>{
        const newSaveData = [...saveData]
        newSaveData[index]=saveObj
        setSaveData(newSaveData)
        localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
    },[saveData])

    useEffect(()=>{
        if(localStorage.getItem(LocalSaveDataName)){
            setSaveData(JSON.parse(localStorage.getItem(LocalSaveDataName)))
        }
        else{
            localStorage.setItem(LocalSaveDataName,JSON.stringify([]))
        }
    },[])

    useEffect(()=>{
        setSaveData(JSON.parse(localStorage.getItem(LocalSaveDataName)))
    },[JSON.stringify(saveData)])

    return {saveData,changeSaveName,deleteSave,createSave,loadSave,overwriteSave}
}