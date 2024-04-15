import React from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import useInput from "component/util/useInputs";
import SinnerEgoIconInput from "../SinnerEgoIconInput/SinnerEgoIconInput";
import DropDown from "component/DropDown/DropDown";
import { EgoLevelDropDown } from "../EgoLevelDropDown/EgoLevelDropDown";

export default function InputStatPage():ReactElement{
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
            Wrath_resistant,
            Lust_resistant,
            Sloth_resistant,
            Gluttony_resistant,
            Gloom_resistant,
            Pride_resistant,
            Envy_resistant,
        },
        sinCost:{
            Wrath_cost,
            Lust_cost,
            Sloth_cost,
            Gluttony_cost,
            Gloom_cost,
            Pride_cost,
            Envy_cost,
        },
        sinnerColor,
        egoLevel,
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
        <div className="sinner-icon-input-container">
            <p>Pick the sinner icon: </p>
            <SinnerEgoIconInput/>
            <p className="center-element">or upload your own icon: <UploadImgBtn onFileInputChange={onChangeFileWithName("sinnerIcon")}/></p>
        </div>
        <div className="sinner-color-input-container">
            <p>Pick a color for your sinner: </p>
            <input className="sinner-color-input" type="color" name="sinnerColor" id="sinnerColor" value={sinnerColor} onChange={onChangeInput("sinnerColor")}/>
        </div>
        <div>
            <div className="center-element">
                <p>Upload Splash Art:  </p>
                <UploadImgBtn onFileInputChange={onChangeFileWithName("splashArt")}/>
            </div>
        </div>
        {splashArt?<div className="input-group-container">
                <p className="center-element">Delete the splash art? <span className="material-symbols-outlined delete-splash-art-btn" onClick={(e:React.MouseEvent<HTMLElement>)=>{setEgoInfoValue({...EgoInfoValue,splashArt:""})}}>
                    delete
                </span></p>
                <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale,translation:{x,y:number}})=>{setEgoInfoValue({...EgoInfoValue,splashArtScale:value.scale,splashArtTranslation:value.translation})}}/>
            </div>:<></>}
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="title">Title: </label>
                <input type="text" className="input block" id="title" name="title" value={title} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Name: </label>
                <input type="text" className="input" id="name" name="name" value={name} onChange={onChangeInput()}/>
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
                <input type="number" className="input" id="sanityCost" name="sanityCost" value={sanityCost} onChange={onChangeInput()} />
            </div>
        </div>
        <p>Sin cost:</p>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="Wrath_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Wrath_cost} onChange={changeSinCost.onChangeInput()} name="Wrath_cost" id="Wrath_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Lust_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Lust_cost} onChange={changeSinCost.onChangeInput()} name="Lust_cost" id="Lust_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Sloth_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Sloth_cost} onChange={changeSinCost.onChangeInput()} name="Sloth_cost" id="Sloth_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Gluttony_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Gluttony_cost} onChange={changeSinCost.onChangeInput()} name="Gluttony_cost" id="Gluttony_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Gloom_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Gloom_cost} onChange={changeSinCost.onChangeInput()} name="Gloom_cost" id="Gloom_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Pride_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Pride_cost} onChange={changeSinCost.onChangeInput()} name="Pride_cost" id="Pride_cost"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Envy_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input input-number" value={Envy_cost} onChange={changeSinCost.onChangeInput()} name="Envy_cost" id="Envy_cost"/>
                    </div>
                </div>
            </div>
        </div>
        <p>Sin resistant:</p>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="Wrath_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Wrath_resistant)}}>
                        <p>{changeResistantText(Wrath_resistant)}</p>
                        <input type="number" className="input input-number" value={Wrath_resistant} onChange={changeSinResistant.onChangeInput()} name="Wrath_resistant" id="Wrath_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Lust_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Lust_resistant)}}>
                        <p>{changeResistantText(Lust_resistant)}</p>
                        <input type="number" className="input input-number" value={Lust_resistant} onChange={changeSinResistant.onChangeInput()} name="Lust_resistant" id="Lust_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Sloth_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Sloth_resistant)}}>
                        <p>{changeResistantText(Sloth_resistant)}</p>
                        <input type="number" className="input input-number" value={Sloth_resistant} onChange={changeSinResistant.onChangeInput()} name="Sloth_resistant" id="Sloth_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Gluttony_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Gluttony_resistant)}}>
                        <p>{changeResistantText(Gluttony_resistant)}</p>
                        <input type="number" className="input input-number" value={Gluttony_resistant} onChange={changeSinResistant.onChangeInput()} name="Gluttony_resistant" id="Gluttony_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Gloom_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Gloom_resistant)}}>
                        <p>{changeResistantText(Gloom_resistant)}</p>
                        <input type="number" className="input input-number" value={Gloom_resistant} onChange={changeSinResistant.onChangeInput()} name="Gloom_resistant" id="Gloom_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Pride_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Pride_resistant)}}>
                        <p>{changeResistantText(Pride_resistant)}</p>
                        <input type="number" className="input input-number" value={Pride_resistant} onChange={changeSinResistant.onChangeInput()} name="Pride_resistant" id="Pride_resistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="Envy_resistant"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(Envy_resistant)}}>
                        <p>{changeResistantText(Envy_resistant)}</p>
                        <input type="number" className="input input-number" value={Envy_resistant} onChange={changeSinResistant.onChangeInput()} name="Envy_resistant" id="Envy_resistant"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}