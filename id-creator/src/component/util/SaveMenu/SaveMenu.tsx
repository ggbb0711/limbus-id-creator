import React, { createContext, useContext, useState } from "react";
import { ReactElement } from "react";
import "./SaveMenu.css"
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import { SaveLocalMenu } from "./SaveLocalMenu/SaveLocalMenu";
import MainButton from "utils/MainButton/MainButton";
import SaveCloudMenu from "./SaveCloudMenu/SaveCloudMenu";
import PopUpMenu from "utils/PopUpMenu/PopUpMenu";
import { ISaveFile, SaveFile } from "Interfaces/ISaveFile";
import Close_icon from "Icons/Close_icon";



const saveMenuContext = createContext(null)

const SaveMenu: React.FC<{children:ReactElement}>=({children})=>{
    const [saveMode,setSaveMode] = useState("Local")
    const [isActive,setIsActive] = useState(false)
    const [localSaveName,setLocalSaveName] = useState("")
    const [saveObjInfoValue,setSaveObjInfoValue] = useState<ISaveFile<IIdInfo|IEgoInfo>>()
    const [loadObjInfoValueCb,setLoadObjInfoValueCb] = useState<(objInfo:IIdInfo|IEgoInfo)=>void>()

    const changeSaveInfo=(saveInfo:IIdInfo|IEgoInfo)=>setSaveObjInfoValue(new SaveFile(saveInfo,"New save file"))

    return<saveMenuContext.Provider value={{isActive,setIsActive,setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb}}>
        <div className={`save-menu-container ${isActive?"":"hidden"}`}>
            <div className={`save-menu-background ${isActive?"":"hidden"}`} onClick={()=>setIsActive(false)}></div>
            <div className={`save-menu-outline ${isActive?"active":""}`}>
                <div className="save-menu-slide-in">
                    <span className="close-save-menu" onClick={()=>setIsActive(false)}><Close_icon/></span>
                    <div className="center-element">
                        <MainButton component={"Cloud"} btnClass={`main-button ${saveMode==="Cloud"?"active":""}`} clickHandler={()=>setSaveMode("Cloud")}/>
                        <MainButton component={"Local"} btnClass={`main-button ${saveMode==="Local"?"active":""}`} clickHandler={()=>setSaveMode("Local")}/>
                    </div>
                    <div className="save-menu-content center-element-vertically">
                        {saveMode==="Local"?<SaveLocalMenu localSaveName={localSaveName} saveObjInfoValue={saveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} isActive={isActive} setIsActive={setIsActive} />:
                        <SaveCloudMenu isActive={isActive} setIsActive={setIsActive} saveObjInfoValue={saveObjInfoValue} setSaveObjInfoValue={setSaveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} saveMode={localSaveName==="IdLocalSaves"?"ID":"Ego"}/>}
                    </div>
                </div>
            </div>
        </div>
        
        {children}
    </saveMenuContext.Provider>
}

const useSaveMenuContext =()=> useContext(saveMenuContext)

export {SaveMenu,useSaveMenuContext}