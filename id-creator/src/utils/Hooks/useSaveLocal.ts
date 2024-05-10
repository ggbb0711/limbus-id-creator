import { ISaveFile } from "Interfaces/ISaveFile";
import { useCallback, useEffect, useState } from "react";


export default function useSaveLocal<SaveObj>(LocalSaveDataName:string){
    const [saveData,setSaveData] = useState<ISaveFile<SaveObj>[]>([]) 

    const changeSaveName=useCallback((index:number,newName:string)=>{
        try{
            const newSaveData = [...saveData]
            newSaveData[index].saveName=newName
            setSaveData(newSaveData)
            localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
        }
        catch(err){
            console.log(err)
        }
        
    },[saveData])

    const deleteSave = useCallback((index:number)=>{
        try {
            const newSaveData = [...saveData]
            newSaveData.splice(index,1)
            setSaveData(newSaveData)
            localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))    
        } catch (error) {
            console.log(error)
        }
        
    },[saveData])

    const createSave = useCallback((saveObj: ISaveFile<SaveObj>)=>{
        try {
            const newSaveData = [...saveData]
            newSaveData.unshift(saveObj)
            setSaveData(newSaveData)
            localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
        } catch (error) {
            console.log(error)
        }
        
    },[saveData])

    const loadSave = useCallback((index: number)=>{
        return saveData[index]
    },[saveData])

    const overwriteSave = useCallback((index: number,saveObj:ISaveFile<SaveObj>)=>{
        try{
            const newSaveData = [...saveData]
            newSaveData[index]=saveObj
            setSaveData(newSaveData)
            localStorage.setItem(LocalSaveDataName,JSON.stringify(newSaveData))
        }
        catch(err){
            console.log(err)
        }
       
    },[saveData])

    useEffect(()=>{
        try{
            if(localStorage.getItem(LocalSaveDataName)){
                setSaveData(JSON.parse(localStorage.getItem(LocalSaveDataName)))
            }
            else{
                localStorage.setItem(LocalSaveDataName,JSON.stringify([]))
            }
        }
        catch(err){
            console.log(err)
        }
        
    },[])

    useEffect(()=>{
        try{
            setSaveData(JSON.parse(localStorage.getItem(LocalSaveDataName)))
        }
        catch(err){
            console.log(err)
        }
    },[JSON.stringify(saveData)])

    return {saveData,changeSaveName,deleteSave,createSave,loadSave,overwriteSave}
}