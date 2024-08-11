import { useAlertContext } from "component/context/AlertContext";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./AlertPopUp.css"
import { IAlert } from "Interfaces/Utils/IAlert";
import Close_icon from "Icons/Close_icon";



export default function AlertPopUp():ReactElement{
    const {alertArr} = useAlertContext()


    return <div className="alert-popup-group">
        {alertArr.map((alert:IAlert)=><Alert status={alert.status} msg={alert.msg} key={alert.alertId}/>)}
    </div>
}

function Alert({status,msg}:{status:string,msg:string}):ReactElement{
    const [slideIn,setSlideIn] = useState(false)

    useEffect(()=>{
        setSlideIn(true)
        setTimeout(() => {
            setSlideIn(false)
        }, 3000);
    },[])

    function getAlertColor(status:string){
        if(status==="Success") return "var(--Gluttony)"
        if(status==="Failure") return "var(--Wrath)"
    }   

    function close(){
        setSlideIn(false)
    }
    
    return <div className={`alert-popup ${slideIn?"active":""}`} style={{backgroundColor:getAlertColor(status)}}>
        <p>{msg}</p>
        <span className="alert-popup-close-icon" onClick={close}><Close_icon /></span>
    </div>
}