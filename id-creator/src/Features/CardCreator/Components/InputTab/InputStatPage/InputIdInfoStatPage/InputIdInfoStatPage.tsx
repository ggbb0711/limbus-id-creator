import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import "./InputIdInfoStatPage.css"
import TagsInput from "react-tagsinput"
import "react-tagsinput/react-tagsinput.css"
import AddIcon from "Assets/Icons/AddIcon"
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import AccordionSection from "Components/AccordionSection/AccordionSection";
import SinnerIconInput from "../SinnerIconInput/SinnerIconInput";
import SinnerRarityIconInput from "../SinnerRarityInput/SinnerRarityInput";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";
import { compressAndReadImage } from "Features/CardCreator/Utils/CompressAndReadImage";
import { useForm } from "react-hook-form";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";

export default function InputIdInfoStatPage({collaspPage}:{collaspPage:()=>void}):ReactElement{
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()

    const { register, setValue, watch, reset } = useForm<IIdInfo>({ defaultValues: structuredClone(idInfoValue) })

    const registerNumber = (name: string) => {
        const reg = register(name as any, { valueAsNumber: true })
        return {
            ...reg,
            onBlur: (e: any) => {
                reg.onBlur(e)
                if (isNaN(e.target.valueAsNumber) || e.target.value === '') {
                    setValue(name as any, 0)
                }
            }
        }
    }

    useEffect(() => { reset(structuredClone(idInfoValue)) }, [JSON.stringify(idInfoValue)])

    useEffect(() => {
        const sub = watch((values) => dispatch(setIdInfo(structuredClone(values) as any)))
        return () => sub.unsubscribe()
    }, [watch, dispatch])

    const traits = watch("traits") ?? []
    const [traitInput, setTraitInput] = useState("")

    function handleAddTrait() {
        const trimmed = traitInput.trim()
        if (trimmed && !traits.includes(trimmed) && traits.length < 10) {
            setValue("traits", [...traits, trimmed])
            setTraitInput("")
        }
    }

    const splashArt = watch("splashArt")
    const splashArtScale = watch("splashArtScale")
    const splashArtTranslation = watch("splashArtTranslation")
    const slashResistant = watch("slashResistant")
    const pierceResistant = watch("pierceResistant")
    const bluntResistant = watch("bluntResistant")

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=1.5) return "var(--Fatal)"

        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<1) return "Endure"
        if(value>=1.5) return "Weak"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
        </div>
        <AccordionSection title="Sinner General Info">
            <div className="sinner-icon-input-container">
                <p>Pick the sinner icon: </p>
                <SinnerIconInput/>
                <UploadImgBtn name="sinner-icon-image-input" id="sinner-icon-image-input" onFileInputChange={async(e)=>{
                    if(e.currentTarget.files && e.currentTarget.files.length>0){
                        const url = await compressAndReadImage(e.currentTarget.files[0])
                        setValue("sinnerIcon",url)
                    }
                }} btnTxt={"Upload sinner icon (<= 100kb)"} maxSize={100000}/>
            </div>
            <div className="sinner-color-input-container">
                <p>Pick a color for your sinner: </p>
                <input className="sinner-color-input" type="color" id="sinnerColor" {...register("sinnerColor")}/>
            </div>
            {splashArt?
                <>
                    <div className="input-group-container">
                        <p>Control the position of the splash art by dragging and zooming on this circle:</p>
                        <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale:number,translation:{x:number,y:number}})=>{
                            setValue("splashArtScale",value.scale)
                            setValue("splashArtTranslation",value.translation)
                        }}/>
                    </div>
                    <div className="input-group-container">
                        <button onClick={()=>setValue("splashArt","")} className="main-button">
                            <p className="center-element delete-txt"><DeleteIcon/> Delete splash art</p>
                        </button>
                    </div>
                </>
               :<></>}
            <UploadImgBtn name="splash-art-image-input" id="splash-art-image-input" onFileInputChange={async(e)=>{
                if(e.currentTarget.files && e.currentTarget.files.length>0){
                    const url = await compressAndReadImage(e.currentTarget.files[0])
                    setValue("splashArt",url)
                }
            }} btnTxt={"Upload splash art (<= 4mb)"} maxSize={4000000}/>
            <div>
                <p>Pick the sinner rarity: </p>
                <SinnerRarityIconInput/>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="title">Title: </label>
                    <input type="text" className="input stat-page-input-border block" id="title" {...register("title")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="name">Name: </label>
                    <input type="text" className="input stat-page-input-border" id="name" {...register("name")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="traits">Traits: ({traits.length}/10)</label>
                    <div className="trait-input-row">
                        <TagsInput
                            value={traits}
                            onChange={(newTags) => setValue("traits", newTags)}
                            addKeys={[13, 9]}
                            onlyUnique
                            maxTags={10}
                            inputValue={traitInput}
                            onChangeInput={setTraitInput}
                            inputProps={{placeholder: "Add trait...", id: "traits"}}
                            className="input stat-page-input-border trait-input"
                            focusedClassName=""
                            tagProps={{className: "trait-tab"}}
                        />
                        <button
                            type="button"
                            className="main-button trait-add-btn"
                            onClick={handleAddTrait}
                            disabled={traits.length >= 10}
                            aria-label="Add trait"
                        >
                            <AddIcon/>
                        </button>
                    </div>
                </div>
            </div>
        </AccordionSection>
        <AccordionSection title="Sinner Stats">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="minSpeed">
                        <img className="stat-icon" src="/Images/stat/stat_speed.webp" alt="speed_icon" /> 
                        <span>Speed from</span></label>
                    <input className="input stat-page-input-border" type="number" id="minSpeed" {...registerNumber("minSpeed")}/>
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="maxSpeed">
                        <img className="stat-icon" src="/Images/stat/stat_speed.webp" alt="speed_icon" /> 
                        <span>Speed to</span>
                    </label>
                    <input className="input stat-page-input-border" type="number" id="maxSpeed" {...registerNumber("maxSpeed")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="hp">
                        <img className="stat-icon" src="/Images/stat/stat_hp.webp" alt="hp_icon" /> 
                        <span>Health</span>
                    </label>
                    <input type="number" className="input stat-page-input-border" id="hp" {...registerNumber("hp")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="defenseLevel">
                        <img className="stat-icon" src="/Images/stat/stat_def.webp" alt="def_icon" /> 
                        <span>Defense</span>
                    </label>
                    <input type="number" className="input stat-page-input-border" id="defenseLevel" {...registerNumber("defenseLevel")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label htmlFor="staggerResist" className="input-label">Stagger Threshold:</label>
                    <input type="text" className="input stat-page-input-border" id="staggerResist" {...register("staggerResist")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="slashResistant">
                        <img className="stat-icon" src="/Images/attack/attackt_slash.webp" alt="attackt_slash" />
                        <span className="input-label">
                            Slash resist (<span style={{color:changeResistantColor(slashResistant)}}>{changeResistantText(slashResistant)}</span>): 
                        </span>
                    </label>
                    <input style={{color:changeResistantColor(slashResistant)}} type="number" className="input stat-page-input-border" {...registerNumber("slashResistant")} id="slashResistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="pierceResistant">
                        <img className="stat-icon" src="/Images/attack/attackt_pierce.webp" alt="attackt_pierce" />
                        <span className="input-label">
                            Pierce resist (<span style={{color:changeResistantColor(pierceResistant)}}>{changeResistantText(pierceResistant)}</span>) :
                        </span>
                    </label>
                    <input style={{color:changeResistantColor(pierceResistant)}} type="number" className="input stat-page-input-border" {...registerNumber("pierceResistant")} id="pierceResistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="bluntResistant">
                        <img className="stat-icon" src="/Images/attack/attackt_blunt.webp" alt="attackt_blunt" />
                        <span>
                            Blunt resist (<span style={{color:changeResistantColor(bluntResistant)}}>{changeResistantText(bluntResistant)}</span>) :
                        </span>
                    </label>
                    <input style={{color:changeResistantColor(bluntResistant)}} type="number" className="input stat-page-input-border" {...registerNumber("bluntResistant")} id="bluntResistant"/>
                </div>
            </div>
        </AccordionSection>
    </div>
}
