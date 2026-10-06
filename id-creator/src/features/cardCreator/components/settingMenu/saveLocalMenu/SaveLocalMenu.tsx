import { appConfig } from "config/env.client";
import React, { useMemo, useState } from "react";
import "../SettingMenu.css"
import { createSaveFile } from "features/cardCreator/utils/save/createSaveFile";
import { sortSavesByTimeDesc } from "features/cardCreator/utils/save/sortSaves";
import { SaveMode } from "features/cardCreator/constants";
import useSaveLocal from "features/cardCreator/hooks/useSaveLocal";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import EditIcon from "assets/icons/EditIcon";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { toCardMode } from "features/cardCreator/contexts/CardModeContext";
import { loadCard } from "features/cardCreator/stores/cardActions";
import { selectCard } from "features/cardCreator/hooks/useCardInfo";
import formatDisplayDate from "utils/formatDisplayDate";


const SaveLocalMenu=({saveMode, close}:{saveMode: SaveMode, close: ()=>void})=>{
    const cardMode = toCardMode(saveMode)
    const cardData = useAppSelector(state => selectCard(state, cardMode))
    const dispatch = useAppDispatch()

    const {saveData,isLoading,deleteSave,createSave,changeSaveName,loadSave,overwriteSave} = useSaveLocal(saveMode)
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
            if(saveData.length<appConfig.limits.card.localSaveMaxLen){
                openPopup()
            }
        }
    }

    const saveSubmit = ()=>{
        if(popupMode==="overwrite"){
            if(nameChangingSaveId) changeSaveName(nameChangingSaveId,newSaveName)
        }
        else{
            createSave(createSaveFile(cardData, newSaveName))
        }
        closePopup()
    }

    const sortedSaves = useMemo(
        ()=>sortSavesByTimeDesc(saveData),
        [saveData]
    )

    return<>
        <div>
            <PopUpMenu open={namePopup} label={popupMode==="overwrite"?"Rename the save":"Name the new save"} onClose={closePopup}>
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
                {sortedSaves.map((data)=>
                    <div className={`save-tab center-element-vertically`} key={data.id}>
                        {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                        <p className="created-time">Last updated: {formatDisplayDate(data.updateTime, { withTime: true })}</p>
                        <p className="created-time">Created: {formatDisplayDate(data.saveTime, { withTime: true })}</p>
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
                                if(!save) return
                                dispatch(loadCard(cardMode, save.saveInfo))
                                close()
                            }}>
                                Load
                            </button>
                        </div>
                    </div>
                )}
            </>:<p style={{fontFamily:"var(--font-mikodacs), var(--font-rubik), sans-serif"}}></p>}
        </div>
        <p>Current local save: {saveData.length}/{appConfig.limits.card.localSaveMaxLen}</p>
        <button className="main-button create-new-save-btn" onClick={createNewSave}>{isLoading?"Loading...":"Create a new save"}</button>
    </>
}

export {SaveLocalMenu}
