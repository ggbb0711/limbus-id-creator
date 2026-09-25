import React from "react";
import { ReactElement } from "react";
import "./SinnerEgoIconInput.css"
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { setEgoInfo } from "features/cardCreator/stores/EgoInfoSlice";

export default function SinnerEgoIconInput():ReactElement{
    const EgoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()

    const set = (sinnerColor: string, sinnerIcon: string) => {
        dispatch(setEgoInfo({...EgoInfoValue, sinnerColor, sinnerIcon}))
    }

    return <div className="sinner-ego-icon-container">
        <img onClick={()=>set("var(--Yi-Sang-color)","/Images/sinner-icon/Yi_Sang_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Yi_Sang_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Yi_Sang_Icon.webp" alt="Yi_Sang_Icon.webp" />
        <img onClick={()=>set("var(--Faust-color)","/Images/sinner-icon/Faust_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Faust_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Faust_Icon.webp" alt="Faust_Icon.webp" />
        <img onClick={()=>set("var(--Don-color)","/Images/sinner-icon/Don_Quixote_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Don_Quixote_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Don_Quixote_Icon.webp" alt="Don_Quixote_icon.webp" />
        <img onClick={()=>set("var(--Ryōshū-color)","/Images/sinner-icon/Ryoshu_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Ryoshu_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Ryoshu_Icon.webp" alt="Ryoshu_Icon.webp" />
        <img onClick={()=>set("var(--Meursault-color)","/Images/sinner-icon/Meursault_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Meursault_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Meursault_Icon.webp" alt="Meursault_Icon.webp" />
        <img onClick={()=>set("var(--Hong-Lu-color)","/Images/sinner-icon/Hong_Lu_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Hong_Lu_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Hong_Lu_Icon.webp" alt="Hong_Lu_Icon.webp" />
        <img onClick={()=>set("var(--Heathcliff-color)","/Images/sinner-icon/Heathcliff_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Heathcliff_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Heathcliff_Icon.webp" alt="Heathcliff_Icon.webp" />
        <img onClick={()=>set("var(--Ishmael-color)","/Images/sinner-icon/Ishmael_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Ishmael_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Ishmael_Icon.webp" alt="Ishmael_Icon.webp" />
        <img onClick={()=>set("var(--Sinclair-color)","/Images/sinner-icon/Sinclair_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Sinclair_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Sinclair_Icon.webp" alt="Sinclair_Icon.webp" />
        <img onClick={()=>set("var(--Rodya-color)","/Images/sinner-icon/Rodion_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Rodion_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Rodion_Icon.webp" alt="Rodion_Icon.webp" />
        <img onClick={()=>set("var(--Outis-color)","/Images/sinner-icon/Outis_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Outis_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Outis_Icon.webp" alt="Outis_Icon.webp" />
        <img onClick={()=>set("var(--Gregor-color)","/Images/sinner-icon/Gregor_Icon.webp")} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Gregor_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Gregor_Icon.webp" alt="Gregor_Icon.webp" />
    </div>
}
