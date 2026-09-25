import React from "react";
import "./SettingMenu.css"
import CloseIcon from "assets/icons/CloseIcon";
import CustomKeywordMenu from "./customKeywordMenu/CustomKeywordMenu";
import SaveCloudMenu from "./saveCloudMenu/SaveCloudMenu";
import { SaveLocalMenu } from "./saveLocalMenu/SaveLocalMenu";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { closeSettingMenu, setSettingDisplayMode } from "stores/slices/UiSlice";

export default function SettingMenu({saveMode}:{saveMode: "ID" | "EGO"}){
    const isActive = useAppSelector(state => state.ui.isSettingMenuActive)
    const displayMode = useAppSelector(state => state.ui.settingMenuDisplayMode)
    const dispatch = useAppDispatch()

    const close = () => dispatch(closeSettingMenu())

    const displaySettings = ()=>{
        if(displayMode==="Local")
            return <SaveLocalMenu saveMode={saveMode} close={close}/>
        else if(displayMode==="Cloud")
            return <SaveCloudMenu saveMode={saveMode}/>
        else if(displayMode==="Custom keywords")
            return <CustomKeywordMenu/>
    }

    if(!isActive) return null

    return <div className={`setting-menu-container`}>
        <div className={`setting-menu-background`} onClick={close}></div>
        <div className={`setting-menu-outline`}>
            <div className="setting-menu-slide-in">
                <span className="close-setting-menu" onClick={close}><CloseIcon/></span>
                <h1 className="setting-header">Settings</h1>
                <div className="center-element">
                    <button className={`main-button ${displayMode==="Cloud"?"active":""}`} onClick={()=>dispatch(setSettingDisplayMode("Cloud"))}>
                        Cloud saves
                    </button>
                    <button className={`main-button ${displayMode==="Local"?"active":""}`} onClick={()=>dispatch(setSettingDisplayMode("Local"))}>
                        Local saves
                    </button>
                    <button className={`main-button ${displayMode==="Custom keywords"?"active":""}`} onClick={()=>dispatch(setSettingDisplayMode("Custom keywords"))}>
                        Custom keywords
                    </button>
                </div>
                <div className="setting-menu-content center-element-vertically">
                    {displaySettings()}
                </div>
            </div>
        </div>
    </div>
}
