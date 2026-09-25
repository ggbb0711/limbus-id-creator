import React, { useEffect, useState } from "react";
import "../SettingMenu.css"
import { SaveFile } from "Types/ISaveFile";
import useSaveLocal from "Features/CardCreator/Hooks/useSaveLocal";
import uuid from "react-uuid";
import PopUpMenu from "Components/PopUpMenu/PopUpMenu";
import EditIcon from "Assets/Icons/EditIcon";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";
import { EnvironmentVariables } from "Config/Environments";
import formatDateForBackend from "Utils/formatDateForBackend";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";
import { setEgoInfo } from "Features/CardCreator/Stores/EgoInfoSlice";


const SaveLocalMenu=({saveMode, close}:{saveMode: "ID" | "EGO", close: ()=>void})=>{
    const localSaveName = saveMode === "ID" ? "IdLocalSaves" : "EgoLocalSaves"
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const egoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()
    const cardData = saveMode === "ID" ? idInfoValue : egoInfoValue

    const {saveData,isLoading,deleteSave,createSave,changeSaveName,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)
    const [namePopup,setNamePopup] = useState(false)
    const [popupMode,setPopupMode] = useState<"create"|"overwrite">("create")
    const [nameChangingSaveId,setNameChangingSaveId] = useState<string|null>(null)
    const [newSaveName,setNewSaveName] = useState("Save "+new Date().toISOString())

    const openPopup = (newSaveName?:string)=>{
        setNamePopup(true)
        setNewSaveName(newSaveName || "Save "+new Date().toISOString())
    }

    const closePopup = () => {
        setNamePopup(false)
        setPopupMode("create")
    }

    const createNewSave = ()=>{
        if(!isLoading){
            const maxLenStr = EnvironmentVariables.NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN
            const maxLen = Number(maxLenStr ?? 10)
            if(saveData.length<maxLen){
                openPopup()
            }
        }
    }

    const saveSubmit = ()=>{
        if(popupMode==="overwrite"){
            if(nameChangingSaveId) changeSaveName(nameChangingSaveId,newSaveName)
        }
        else{
            const saveFile = new SaveFile(cardData, newSaveName)
            saveFile.id = uuid()
            saveFile.name = newSaveName
            const createdDate = formatDateForBackend(new Date())
            createSave({...saveFile, updateTime:createdDate, saveTime: createdDate})
        }
        closePopup()
    }

    //Some of the save can have the same id
    //This is to create new save for some
    //of the save with same id
    useEffect(()=>{
        saveData.map(save=>{
            if(saveData.some(s=>s.id===save.id)||!save.id) save.id = uuid()
            return save
        })
    },[localSaveName])

    return<>
        <div className={`${namePopup?"":"hidden"}`}>
            <PopUpMenu setIsActive={()=>{
                    closePopup()
                }}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name"
                    value={newSaveName}
                    onChange={(e)=>{
                        setNewSaveName(e.target.value)
                    }}/>
                    <button className="main-button create-new-save-btn" onClick={saveSubmit}>{popupMode==="overwrite"?"Update":"Create"}</button>
                </div>
            </PopUpMenu>
        </div>
        <div className="save-menu-list local">
            {saveData.length>0?<>
                {saveData.sort((a,b)=>{
                    const prevDate = new Date(a.saveTime)
                    const nextDate = new Date(b.saveTime)

                    return prevDate < nextDate ? 1 : -1
                }).map((data)=>
                    <div className={`save-tab center-element-vertically`} key={data.id}>
                        {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                        <p className="created-time">Last updated: {data.updateTime}</p>
                        <p className="created-time">Created: {data.saveTime}</p>
                        <div className="center-element save-tab-input-container">
                            <p>{data.name}</p>
                            <div onClick={()=>{
                                setPopupMode("overwrite")
                                setNameChangingSaveId(data.id)
                                openPopup(data.name)
                            }}>
                                <EditIcon/>
                            </div>
                        </div>
                        <div className="center-element">
                            <button className="main-button" onClick={()=>deleteSave(data.id)}>
                                Delete
                            </button>
                            <button className="main-button" onClick={()=>{
                                overwriteSave(data.id, cardData)
                            }}>
                                Overwrite
                            </button>
                            <button className="main-button" onClick={async ()=>{
                                const save = await loadSave(data.id)
                                if(save){
                                    if(saveMode === "ID") dispatch(setIdInfo(save.saveInfo as IIdInfo))
                                    else dispatch(setEgoInfo(save.saveInfo as IEgoInfo))
                                }
                                close()
                            }}>
                                Load
                            </button>
                        </div>
                    </div>
                )}
            </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}></p>}
        </div>
        <p>Current local save: {saveData.length}/{EnvironmentVariables.NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN??10}</p>
        <button className="main-button create-new-save-btn" onClick={createNewSave}>{isLoading?"Loading...":"Create a new save"}</button>
    </>
}

export {SaveLocalMenu}
