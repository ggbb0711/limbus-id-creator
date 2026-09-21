import { Table } from "dexie";
import { ISaveFile } from "Types/ISaveFile";
import { useCallback, useEffect, useState } from "react";
import { indexDB, normalizeLocalSave } from "Features/CardCreator/Utils/IndexDB";
import formatDateForBackend from "Utils/formatDateForBackend";


export default function useSaveLocal<SaveObj>(LocalSaveDataName:string){
    const [saveDataTable,setSaveDataTable] = useState<Table<any>|null>(null)
    const [saveData,setSaveData] = useState<ISaveFile<SaveObj>[]>([]) 
    const [isLoading, setIsLoading] = useState(false)

    const deleteSave = useCallback(async (id:string)=>{
        if(!saveDataTable) return null
        try {
           setIsLoading(true)
           await saveDataTable?.delete(id)
           setSaveData(saveData.filter((item)=>item.id!==id))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    },[saveData, saveDataTable])

    const createSave = useCallback(async (saveObj: ISaveFile<SaveObj>)=>{
        if(!saveDataTable) return null
        try {
           setIsLoading(true)
           const id = await saveDataTable?.add(saveObj)
           console.log("Saved with id: ",id)
           setSaveData([{ ...saveObj},...saveData])
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData, saveDataTable])

    const getAllSaves = useCallback(async () => {
        if (!saveDataTable) return null
        const raw = await saveDataTable.toArray()
        return raw.map(r => normalizeLocalSave<SaveObj>(r))
    }, [saveDataTable])

    const loadSave = useCallback(async (id: string)=>{
        if(!saveDataTable) return null
        const raw = await saveDataTable.get(id)
        return raw ? normalizeLocalSave<SaveObj>(raw) : null
    },[saveDataTable])

    const changeSaveName = useCallback(async(id:string,newName:string)=>{
        if(!saveDataTable) return null
        try{
            await saveDataTable.update(id, {name: newName, updateTime: formatDateForBackend(new Date())})
            setSaveData(saveData.map(item=>item.id===id?
                {...item, name: newName, updateTime: formatDateForBackend(new Date())}:
                item
            ))
        }
        catch(error){
            console.log(error)
        }
    },[saveData, saveDataTable])

    const overwriteSave = useCallback(async (id: string,saveObj:SaveObj)=>{
        if(!saveDataTable) return null
        try {
            setIsLoading(true)
            await saveDataTable.update(id, {saveInfo: saveObj, updateTime: formatDateForBackend(new Date())})
            setSaveData(saveData.map(item=>item.id===id?
                {...item, saveInfo: saveObj, updateTime: formatDateForBackend(new Date())}:
                item
            ))
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData,saveDataTable])


    useEffect(()=>{
        if(LocalSaveDataName)setSaveDataTable(indexDB.table(LocalSaveDataName))
    },[LocalSaveDataName])

    useEffect(()=>{
        if(saveDataTable)getAllSaves().then(saves=>{
            if(saves) setSaveData(saves)
        })
    },[saveDataTable,getAllSaves])

    return {saveData,isLoading,deleteSave,createSave,getAllSaves,changeSaveName,loadSave,overwriteSave}
}