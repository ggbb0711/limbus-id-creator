import React from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import useInput from "component/util/useInputs";
import SinnerEgoIconInput from "../SinnerEgoIconInput/SinnerEgoIconInput";
import DropDown from "component/util/DropDown/DropDown";
import { EgoLevelDropDown } from "../EgoLevelDropDown/EgoLevelDropDown";
import Arrow_down_icon from "Icons/Arrow_down_icon";

export default function InputStatPage({collaspPage}:{collaspPage:()=>void}):ReactElement{
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()
    const {onChangeInput,onChangeFileWithName,onChangeDropDownMenu}=useInput(EgoInfoValue,(newVal:{[type:string]:string})=>setEgoInfoValue(newVal))
    const changeSinResistant=useInput(EgoInfoValue.sinResistant,(newVal:{[type:string]:string})=>setEgoInfoValue({...EgoInfoValue,sinResistant:newVal}))
    const changeSinCost=useInput(EgoInfoValue.sinCost,(newVal:{[type:string]:string})=>setEgoInfoValue({...EgoInfoValue,sinCost:newVal}))
    

    const {
        title,
        name,
        sanityCost,
        splashArt,
        splashArtScale,
        splashArtTranslation,
        sinResistant:{
            wrath_resistant,
            lust_resistant,
            sloth_resistant,
            gluttony_resistant,
            gloom_resistant,
            pride_resistant,
            envy_resistant,
        },
        sinCost:{
            wrath_cost,
            lust_cost,
            sloth_cost,
            gluttony_cost,
            gloom_cost,
            pride_cost,
            envy_cost,
        },
        sinnerColor,
    } = EgoInfoValue

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=2.0) return "var(--Fatal)"
        
        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<1) return "Endure"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <Arrow_down_icon></Arrow_down_icon>
            </div>
        </div>
        <div className="sinner-icon-input-container">
            <p>Pick the sinner icon: </p>
            <SinnerEgoIconInput/>
            <UploadImgBtn onFileInputChange={onChangeFileWithName("sinnerIcon")} btnTxt={"Upload sinner icon (<= 80kb)"} maxSize={80000}/>
        </div>
        <div className="sinner-color-input-container">
            <p>Pick a color for your sinner: </p>
            <input className="sinner-color-input" type="color" name="sinnerColor" id="sinnerColor" value={sinnerColor} onChange={onChangeInput("sinnerColor")}/>
        </div>
        {splashArt?<div className="input-group-container">
                <p className="center-element">Delete the splash art? <span className="material-symbols-outlined delete-splash-art-btn" onClick={(e:React.MouseEvent<HTMLElement>)=>{setEgoInfoValue({...EgoInfoValue,splashArt:""})}}>
                    delete
                </span></p>
                <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale,translation:{x,y:number}})=>{setEgoInfoValue({...EgoInfoValue,splashArtScale:value.scale,splashArtTranslation:value.translation})}}/>
            </div>:<></>}
        <UploadImgBtn onFileInputChange={onChangeFileWithName("splashArt")} btnTxt={"Upload splash art (<= 1.2mb)"} maxSize={1200000}/>
        
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="title">Title: </label>
                <input type="text" className="input stat-page-input-border block" id="title" name="title" value={title} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Name: </label>
                <input type="text" className="input stat-page-input-border" id="name" name="name" value={name} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <p>Ego level:</p>
                <DropDown dropDownEl={EgoLevelDropDown} cb={onChangeDropDownMenu("egoLevel")}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label htmlFor="sanityCost">Sanity cost:</label>
                <input type="number" className="input stat-page-input-border" id="sanityCost" name="sanityCost" value={sanityCost} onChange={onChangeInput()} />
            </div>
        </div>
        <p>Sin cost:</p>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="wrath_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={wrath_cost} onChange={changeSinCost.onChangeInput()} name="wrath_cost" id="wrath_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="lust_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={lust_cost} onChange={changeSinCost.onChangeInput()} name="lust_cost" id="lust_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="sloth_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={sloth_cost} onChange={changeSinCost.onChangeInput()} name="sloth_cost" id="sloth_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="gluttony_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gluttony_cost} onChange={changeSinCost.onChangeInput()} name="gluttony_cost" id="gluttony_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="gloom_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gloom_cost} onChange={changeSinCost.onChangeInput()} name="gloom_cost" id="gloom_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="pride_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={pride_cost} onChange={changeSinCost.onChangeInput()} name="pride_cost" id="pride_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="envy_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={envy_cost} onChange={changeSinCost.onChangeInput()} name="envy_cost" id="envy_cost"/>
                    </div>
                </div>
            </div>
        </div>
        <p>Sin resistant:</p>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="wrath_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p  style={{color:changeResistantColor(wrath_resistant)}}>{changeResistantText(wrath_resistant)}</p>
                        <input style={{color:changeResistantColor(wrath_resistant)}} type="number" className="input stat-page-input-border input-number" value={wrath_resistant} onChange={changeSinResistant.onChangeInput()} name="wrath_resistant" id="wrath_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="lust_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(lust_resistant)}}>{changeResistantText(lust_resistant)}</p>
                        <input style={{color:changeResistantColor(lust_resistant)}} type="number" className="input stat-page-input-border input-number" value={lust_resistant} onChange={changeSinResistant.onChangeInput()} name="lust_resistant" id="lust_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="sloth_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(sloth_resistant)}}>{changeResistantText(sloth_resistant)}</p>
                        <input style={{color:changeResistantColor(sloth_resistant)}} type="number" className="input stat-page-input-border input-number" value={sloth_resistant} onChange={changeSinResistant.onChangeInput()} name="sloth_resistant" id="sloth_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="gluttony_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(gluttony_resistant)}}>{changeResistantText(gluttony_resistant)}</p>
                        <input style={{color:changeResistantColor(gluttony_resistant)}} type="number" className="input stat-page-input-border input-number" value={gluttony_resistant} onChange={changeSinResistant.onChangeInput()} name="gluttony_resistant" id="gluttony_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="gloom_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(gloom_resistant)}}>{changeResistantText(gloom_resistant)}</p>
                        <input style={{color:changeResistantColor(gloom_resistant)}} type="number" className="input stat-page-input-border input-number" value={gloom_resistant} onChange={changeSinResistant.onChangeInput()} name="gloom_resistant" id="gloom_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="pride_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(pride_resistant)}}>{changeResistantText(pride_resistant)}</p>
                        <input style={{color:changeResistantColor(pride_resistant)}} type="number" className="input stat-page-input-border input-number" value={pride_resistant} onChange={changeSinResistant.onChangeInput()} name="pride_resistant" id="pride_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="envy_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(envy_resistant)}}>{changeResistantText(envy_resistant)}</p>
                        <input style={{color:changeResistantColor(envy_resistant)}} type="number" className="input stat-page-input-border input-number" value={envy_resistant} onChange={changeSinResistant.onChangeInput()} name="envy_resistant" id="envy_resistant"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}