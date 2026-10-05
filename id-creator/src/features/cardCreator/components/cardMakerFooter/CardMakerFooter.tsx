import React, { useState } from "react";
import DownloadImg from "features/cardCreator/utils/image/DownloadImg";
import "./CardMakerFooter.css"
import DownloadIcon from "assets/icons/DownloadIcon";
import SettingIcon from "assets/icons/SettingIcon";
import useAlert from "hooks/useAlert";
import { useCardDomRef } from "features/cardCreator/contexts/CardDomRefContext";
import { useAppDispatch } from "stores/AppStore";
import { openSettingMenu } from "features/cardCreator/stores/SettingMenuSlice";

export default function CardMakerFooter(){
    const dispatch = useAppDispatch()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlert()
    const domRef = useCardDomRef()


    const downloadImg = async ()=>{
        if(isLoading || !domRef.current) return
        setIsLoading(true)
        try {
            const { default: TurnRefToImg } = await import("features/cardCreator/utils/image/TurnRefToImg")
            const imgUrl = await TurnRefToImg(domRef)
            DownloadImg(imgUrl,"Custom")
            addAlert("Success","Download started")
        } catch (err) {
            console.log(err)
            addAlert("Failure","ERROR: Missing asset detected. Please look for and update the missing asset.")
        } finally {
            setIsLoading(false)
        }
    }

    return <div className="card-maker-footer">
        <div className="card-maker-footer-components">
            <div className="center-element card-maker-footer-component" onClick={downloadImg}>
                <DownloadIcon width="16px" height="16px"/>
                <p>{isLoading? "Downloading..." :"Download"}</p>
            </div>
            <div className="center-element card-maker-footer-component" onClick={()=>dispatch(openSettingMenu())}>
                <SettingIcon width="16px" height="16px"/>
                <p>Setting/Saves</p>
            </div>
        </div>
    </div>
}
