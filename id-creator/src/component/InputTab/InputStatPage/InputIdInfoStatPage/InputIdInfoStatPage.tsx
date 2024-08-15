import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import SinnerIconInput from "../SinnerIconInput/SinnerIconInput";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import SinnerRarityIconInput from "../SinnerRarityInput/SinnerRarityInput";
import Delete_icon from "Icons/Delete_icon";
import MainButton from "utils/MainButton/MainButton";


export default function InputIdInfoStatPage():ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    
    const {
        minSpeed,
        maxSpeed,
        hp,
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
        return(e:React.ChangeEvent<HTMLInputElement>)=>{
            let url="";
            const fr = new FileReader()
            console.log(url)
            if(e.currentTarget.files.length>0){
                fr.readAsDataURL(e.currentTarget.files[0])

                fr.addEventListener("load",()=>{
                    url=fr.result as any
                    setIdInfoValue({...idInfoValue,[name]:url})
                })
            }
        }
    }

    return <div className="input-page input-stat-page">
        <div className="sinner-icon-input-container">
            <p>Pick the sinner icon: </p>
            <SinnerIconInput/>
            <UploadImgBtn onFileInputChange={onFileInputChange("sinnerIcon")} btnTxt={"Upload sinner icon (<= 80kb)"} maxSize={80000}/>
        </div>
        <div className="sinner-color-input-container">
            <p>Pick a color for your sinner: </p>
            <input className="sinner-color-input" type="color" name="sinnerColor" id="sinnerColor" value={sinnerColor} onChange={onChangeInput}/>
        </div>
        {splashArt?
            <>
                <div className="input-group-container">
                    <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                    <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale:number,translation:{x:number,y:number}})=>{setIdInfoValue({...idInfoValue,splashArtScale:value.scale,splashArtTranslation:value.translation})}}/>
                </div>
                <div className="input-group-container">
                    <MainButton component={<p className="center-element delete-txt"><Delete_icon/> Delete splash art</p>} clickHandler={()=>{setIdInfoValue({...idInfoValue,splashArt:""})}} btnClass="main-button"/>
                </div>
            </>
           :<></>}

        <UploadImgBtn onFileInputChange={onFileInputChange("splashArt")} btnTxt={"Upload splash art (<= 1.2mb)"} maxSize={1200000}/>
        
        <div>
            <p>Pick the sinner rarity: </p>
            <SinnerRarityIconInput/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="title">Title: </label>
                <input type="text" className="input stat-page-input-border block" id="title" name="title" value={title} onChange={onChangeInput}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Name: </label>
                <input type="text" className="input stat-page-input-border" id="name" name="name" value={name} onChange={onChangeInput}/>
            </div>
        </div>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="minSpeed"><img className="stat-icon" src="Images/stat/stat_speed.webp" alt="speed_icon" /></label>
                <div>
                    <input className="input stat-page-input-border input-number" type="number" name="minSpeed" id="minSpeed" value={minSpeed} onChange={onChangeInput}/> - 
                    <input className="input stat-page-input-border input-number" type="number" name="maxSpeed" id="maxSpeed" value={maxSpeed} onChange={onChangeInput}/>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="hp"><img className="stat-icon" src="Images/stat/stat_hp.webp" alt="hp_icon" /></label>
                <input type="number" className="input stat-page-input-border input-number" name="hp" id="hp" value={hp} onChange={onChangeInput}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="defenseLevel"><img className="stat-icon" src="Images/stat/stat_def.webp" alt="def_icon" /></label>
                <input type="number" className="input stat-page-input-border input-number" name="defenseLevel" id="defenseLevel" value={defenseLevel} onChange={onChangeInput}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="staggerResist">Stagger Threshold:</label>
                <input type="text" className="input stat-page-input-border" name="staggerResist" id="staggerResist" value={staggerResist} onChange={onChangeInput}/>
            </div>
        </div>
        <div  className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="slashResistant"><img className="stat-icon" src="Images/attack/attackt_slash.webp" alt="attackt_slash" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(slashResistant)}}>{changeResistantText(slashResistant)}</p>
                        <input style={{color:changeResistantColor(slashResistant)}} type="number" className="input stat-page-input-border input-number" value={slashResistant} onChange={onChangeInput} name="slashResistant" id="slashResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="pierceResistant"><img className="stat-icon" src="Images/attack/attackt_pierce.webp" alt="attackt_pierce" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(pierceResistant)}}>{changeResistantText(pierceResistant)}</p>
                        <input style={{color:changeResistantColor(pierceResistant)}} type="number" className="input stat-page-input-border input-number" value={pierceResistant} onChange={onChangeInput} name="pierceResistant" id="pierceResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="bluntResistant"><img className="stat-icon" src="Images/attack/attackt_blunt.webp" alt="attackt_blunt" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(bluntResistant)}}>{changeResistantText(bluntResistant)}</p>
                        <input style={{color:changeResistantColor(bluntResistant)}} type="number" className="input stat-page-input-border input-number" value={bluntResistant} onChange={onChangeInput} name="bluntResistant" id="bluntResistant"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}