import React from "react";
import { ReactElement } from "react";
import "./SinnerEgoIconInput.css"
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import { IEgoInfo } from "Interfaces/IEgoInfo";

export default function SinnerEgoIconInput():ReactElement{
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()

    
    return <div className="sinner-ego-icon-container">
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Yi-Sang-color)",sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Yi_Sang_Icon.png"?"active":""}`} src="Images/sinner-icon/Yi_Sang_Icon.png" alt="Yi_Sang_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Faust-color)",sinnerIcon:"Images/sinner-icon/Faust_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Faust_Icon.png"?"active":""}`} src="Images/sinner-icon/Faust_Icon.png" alt="Faust_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Don-color)",sinnerIcon:"Images/sinner-icon/Don_Quixote_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Don_Quixote_Icon.png"?"active":""}`} src="Images/sinner-icon/Don_Quixote_Icon.png" alt="Don_Quixote_icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Ryōshū-color)",sinnerIcon:"Images/sinner-icon/Ryoshu_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Ryoshu_Icon.png"?"active":""}`} src="Images/sinner-icon/Ryoshu_Icon.png" alt="Ryoshu_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Meursault-color)",sinnerIcon:"Images/sinner-icon/Meursault_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Meursault_Icon.png"?"active":""}`} src="Images/sinner-icon/Meursault_Icon.png" alt="Meursault_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Hong-Lu-color)",sinnerIcon:"Images/sinner-icon/Hong_Lu_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Hong_Lu_Icon.png"?"active":""}`} src="Images/sinner-icon/Hong_Lu_Icon.png" alt="Hong_Lu_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Heathcliff-color)",sinnerIcon:"Images/sinner-icon/Heathcliff_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Heathcliff_Icon.png"?"active":""}`} src="Images/sinner-icon/Heathcliff_Icon.png" alt="Heathcliff_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Ishmael-color)",sinnerIcon:"Images/sinner-icon/Ishmael_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Ishmael_Icon.png"?"active":""}`} src="Images/sinner-icon/Ishmael_Icon.png" alt="Ishmael_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Sinclair-color)",sinnerIcon:"Images/sinner-icon/Sinclair_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Sinclair_Icon.png"?"active":""}`} src="Images/sinner-icon/Sinclair_Icon.png" alt="Sinclair_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Rodya-color)",sinnerIcon:"Images/sinner-icon/Rodion_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Rodion_Icon.png"?"active":""}`} src="Images/sinner-icon/Rodion_Icon.png" alt="Rodion_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Outis-color)",sinnerIcon:"Images/sinner-icon/Outis_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Outis_Icon.png"?"active":""}`} src="Images/sinner-icon/Outis_Icon.png" alt="Outis_Icon.png" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Gregor-color)",sinnerIcon:"Images/sinner-icon/Gregor_Icon.png"}))} className={`sinner-icon ${EgoInfoValue.sinnerIcon==="Images/sinner-icon/Gregor_Icon.png"?"active":""}`} src="Images/sinner-icon/Gregor_Icon.png" alt="Gregor_Icon.png" />
    </div>
}