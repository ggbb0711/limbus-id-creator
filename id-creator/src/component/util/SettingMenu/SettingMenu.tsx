import React, { createContext, useCallback, useContext, useState } from "react";
import { ReactElement } from "react";
import "./SettingMenu.css"
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import { SaveLocalMenu } from "./SaveLocalMenu/SaveLocalMenu";
import MainButton from "utils/MainButton/MainButton";
import SaveCloudMenu from "./SaveCloudMenu/SaveCloudMenu";
import { ISaveFile, SaveFile } from "Interfaces/ISaveFile";
import Close_icon from "Icons/Close_icon";
import CustomKeywordMenu from "./CustomKeywordMenu/CustomKeywordMenu";



const settingMenuContext = createContext(null)

const SettingMenu: React.FC<{children:ReactElement}>=({children})=>{
    const [displayMode,setDisplayMode] = useState("Local")
    const [isActive,setIsActive] = useState(false)
    const [localSaveName,setLocalSaveName] = useState("")
    const [saveObjInfoValue,setSaveObjInfoValue] = useState<ISaveFile<IIdInfo|IEgoInfo>>()
    const [loadObjInfoValueCb,setLoadObjInfoValueCb] = useState<(objInfo:IIdInfo|IEgoInfo)=>void>()

    const changeSaveInfo=(saveInfo:IIdInfo|IEgoInfo)=>setSaveObjInfoValue(new SaveFile(saveInfo,"New save file"))

    const displaySettings = ()=>{
        if(displayMode==="Local")
            return <SaveLocalMenu localSaveName={localSaveName} saveObjInfoValue={saveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} isActive={isActive} setIsActive={setIsActive} />
        else if(displayMode==="Cloud") 
            return <SaveCloudMenu isActive={isActive} setIsActive={setIsActive} saveObjInfoValue={saveObjInfoValue} setSaveObjInfoValue={setSaveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} saveMode={localSaveName==="IdLocalSaves"?"ID":"Ego"}/>
        else if(displayMode==="Custom keywords")
            return <CustomKeywordMenu/>
    }

    return<settingMenuContext.Provider value={{isActive,setIsActive,setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb}}>
        <div className={`setting-menu-container ${isActive?"":"hidden"}`}>
            <div className={`setting-menu-background ${isActive?"":"hidden"}`} onClick={()=>setIsActive(false)}></div>
            <div className={`setting-menu-outline ${isActive?"active":""}`}>
                <div className="setting-menu-slide-in">
                    <span className="close-setting-menu" onClick={()=>setIsActive(false)}><Close_icon/></span>
                    <h1 className="setting-header">Settings</h1>
                    <div className="center-element">
                        <MainButton component={"Cloud saves"} btnClass={`main-button ${displayMode==="Cloud"?"active":""}`} clickHandler={()=>setDisplayMode("Cloud")}/>
                        <MainButton component={"Local saves"} btnClass={`main-button ${displayMode==="Local"?"active":""}`} clickHandler={()=>setDisplayMode("Local")}/>
                        <MainButton component={"Custom keywords"} btnClass={`main-button ${displayMode==="Custom keywords"?"active":""}`} clickHandler={()=>setDisplayMode("Custom keywords")}/>
                    </div>
                    <div className="setting-menu-content center-element-vertically">
                        {displaySettings()}
                    </div>
                </div>
            </div>
        </div>
        
        {children}
    </settingMenuContext.Provider>
}

const useSettingMenuContext =()=> useContext(settingMenuContext)

export {SettingMenu,useSettingMenuContext}