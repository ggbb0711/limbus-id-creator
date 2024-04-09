import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import "./InputStatPage.css"
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";
import SinnerIconInput from "./SinnerIconInput/SinnerIconInput";
import SinnerSplashArtRepositionInput from "./SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import SinnerRarityIconInput from "./SinnerRarityInput/SinnerRarityInput";

export default function InputStatPage():ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    
    const {
        minSpeed,
        maxSpeed,
        HP,
        staggerResist,
        defenseLevel,
        slashResistant,
        pierceResistant,
        bluntResistant,
        name,
        title,
        sinnerColor,
        splashArt,
        splashArtScale,
        splashArtTranslation,
    }=idInfoValue

    function onChangeInput(e:React.ChangeEvent<HTMLInputElement>){
        setIdInfoValue((idInfoValue)=>({...idInfoValue,[e.target.name]:e.target.value}))
    }

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

    function onFileInputChange(name:string){
        return((e:React.ChangeEvent<HTMLInputElement>):void=>{
            const files=e.currentTarget.files
            setIdInfoValue({...idInfoValue,[name]:(files)?URL.createObjectURL(files[0]):""})
        })
    }


    return <div className="input-page input-stat-page">
        <div className="sinner-icon-input-container">
            <p>Pick the sinner icon: </p>
            <SinnerIconInput/>
            <p className="center-element">or upload your own icon: <UploadImgBtn onFileInputChange={onFileInputChange("sinnerIcon")}/></p>
        </div>
        <div className="sinner-color-input-container">
            <p>Pick a color for your sinner: </p>
            <input className="sinner-color-input" type="color" name="sinnerColor" id="sinnerColor" value={sinnerColor} onChange={onChangeInput}/>
        </div>
        <div>
            <div className="center-element">
                <p>Upload Splash Art:  </p>
                <UploadImgBtn onFileInputChange={onFileInputChange("splashArt")}/>
            </div>
        </div>
        {splashArt?<div className="input-group-container">
                <p className="center-element">Delete the splash art? <span className="material-symbols-outlined delete-splash-art-btn" onClick={(e:React.MouseEvent<HTMLElement>)=>{setIdInfoValue({...idInfoValue,splashArt:""})}}>
                    delete
                </span></p>
                <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale:number,translation:{x:number,y:number}})=>{setIdInfoValue({...idInfoValue,splashArtScale:value.scale,splashArtTranslation:value.translation})}}/>
            </div>:<></>}
        <div>
            <p>Pick the sinner rarity: </p>
            <SinnerRarityIconInput/>
        </div>
        <div className="sinner-input-section-container sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="name">Name: </label>
                <input type="text" className="input" id="name" name="name" value={name} onChange={onChangeInput}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="title">Title: </label>
                <input type="text" className="input" id="title" name="title" value={title} onChange={onChangeInput}/>
            </div>
        </div>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="minSpeed"><img className="stat-icon" src="Images/stat/stat_speed.webp" alt="speed_icon" /></label>
                <div>
                    <input className="input input-number" type="number" name="minSpeed" id="minSpeed" value={minSpeed} onChange={onChangeInput}/> - 
                    <input className="input input-number" type="number" name="maxSpeed" id="maxSpeed" value={maxSpeed} onChange={onChangeInput}/>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="HP"><img className="stat-icon" src="Images/stat/stat_hp.webp" alt="hp_icon" /></label>
                <input type="number" className="input input-number" name="HP" id="HP" value={HP} onChange={onChangeInput}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="defenseLevel"><img className="stat-icon" src="Images/stat/stat_def.webp" alt="def_icon" /></label>
                <input type="number" className="input input-number" name="defenseLevel" id="defenseLevel" value={defenseLevel} onChange={onChangeInput}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="staggerResist">Stagger Threshold:</label>
                <input type="text" className="input" name="staggerResist" id="staggerResist" value={staggerResist} onChange={onChangeInput}/>
            </div>
        </div>
        <div  className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="slashResistant"><img className="stat-icon" src="Images/attack/attackt_slash.webp" alt="attackt_slash" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(slashResistant)}}>
                        <p>{changeResistantText(slashResistant)}</p>
                        <input type="number" className="input input-number" value={slashResistant} onChange={onChangeInput} name="slashResistant" id="slashResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="pierceResistant"><img className="stat-icon" src="Images/attack/attackt_pierce.webp" alt="attackt_pierce" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(pierceResistant)}}>
                        <p>{changeResistantText(pierceResistant)}</p>
                        <input type="number" className="input input-number" value={pierceResistant} onChange={onChangeInput} name="pierceResistant" id="pierceResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="bluntResistant"><img className="stat-icon" src="Images/attack/attackt_blunt.webp" alt="attackt_blunt" /></label>
                <div className="resistant-content">
                    <div style={{color:changeResistantColor(bluntResistant)}}>
                        <p>{changeResistantText(bluntResistant)}</p>
                        <input type="number" className="input input-number" value={bluntResistant} onChange={onChangeInput} name="bluntResistant" id="bluntResistant"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}