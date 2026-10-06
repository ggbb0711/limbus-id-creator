import React from "react";
import "./SettingMenu.css"
import CloseIcon from "assets/icons/CloseIcon";
import CustomKeywordMenu from "./customKeywordMenu/CustomKeywordMenu";
import SaveCloudMenu from "./saveCloudMenu/SaveCloudMenu";
import { SaveLocalMenu } from "./saveLocalMenu/SaveLocalMenu";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { closeSettingMenu, setSettingDisplayMode } from "features/cardCreator/stores/SettingMenuSlice";
import IconButton from "components/ui/iconButton/IconButton";
import Dialog from "components/ui/dialog/Dialog";

export default function SettingMenu(){
    const isActive = useAppSelector(state => state.settingMenu.isSettingMenuActive)
    const displayMode = useAppSelector(state => state.settingMenu.settingMenuDisplayMode)
    const dispatch = useAppDispatch()

    const close = () => dispatch(closeSettingMenu())

    const displaySettings = ()=>{
        if(displayMode==="Local")
            return <SaveLocalMenu close={close}/>
        else if(displayMode==="Cloud")
            return <SaveCloudMenu/>
        else if(displayMode==="Custom keywords")
            return <CustomKeywordMenu/>
    }

    return <Dialog open={isActive} onClose={close} label="Settings" className="setting-menu-container" backdropClassName="setting-menu-background" contentClassName="setting-menu-outline">
        <div className="setting-menu-slide-in">
            <IconButton className="close-setting-menu" label="Close settings" onClick={close}><CloseIcon/></IconButton>
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
    </Dialog>
}
