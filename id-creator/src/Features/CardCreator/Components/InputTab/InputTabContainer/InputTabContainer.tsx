import React, { ReactElement, useState, useRef, useCallback, useEffect } from "react";
import "./InputTabContainer.css"
import { IOffenseSkill } from "Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill";
import { ICustomEffect } from "Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect";
import { IPassiveSkill } from "Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill";
import InputCustomEffectPage from "../InputCustomEffectPage/InputCustomEffectPage";
import InputDefenseSkillPage from "../InputDefenseSkillPage/InputDefenseSkillPage";
import InputMentalEffect from "../InputMentalEffect/InputMentalEffect";
import InputOffenseSkillPage from "../InputOffenseSkillPage/InputOffenseSkillPage";
import InputPassivePage from "../InputPassivePage/InputPassivePage";
import InputIdInfoStatPage from "../InputStatPage/InputIdInfoStatPage/InputIdInfoStatPage";
import InputEgoInfoStatPage from "../InputStatPage/InputEgoInfoStatPage/InputEgoInfoStatPage";
import InputTabSide from "../InputTabSide/InputTabSide";
import useAlert from "Hooks/useAlert";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { addIdInfoSkill } from "Features/CardCreator/Stores/IdInfoSlice";
import { addEgoInfoSkill } from "Features/CardCreator/Stores/EgoInfoSlice";
import { useCardMode } from "Features/CardCreator/Contexts/CardModeContext";
import { SkillDetail } from "Features/CardCreator/Types/SkillDetail";

const MIN_CLOSE_WIDTH = 240
const MAX_WIDTH = 700
const DEFAULT_WIDTH = 400
const STORAGE_KEY = "inputPanelWidth"

function getSavedWidth(): number {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
        const num = Number(saved)
        if (num >= MIN_CLOSE_WIDTH && num <= MAX_WIDTH) return num
    }
    return DEFAULT_WIDTH
}

export default function InputTabContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const mode = useCardMode()
    const dispatch = useAppDispatch()
    const skillDetails = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails : state.egoInfo.value.skillDetails
    )
    const sinnerIcon = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.sinnerIcon : state.egoInfo.value.sinnerIcon
    )
    const {addAlert} = useAlert()

    const [panelWidth, setPanelWidth] = useState(getSavedWidth)
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches)
    const isDragging = useRef(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)")
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    const isPanelOpen = activeTab !== -2

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isDragging.current = true
        document.body.style.cursor = "col-resize"
        document.body.style.userSelect = "none"
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return
            const containerRect = containerRef.current.getBoundingClientRect()
            const newWidth = e.clientX - containerRect.left
            if (newWidth < MIN_CLOSE_WIDTH) {
                isDragging.current = false
                document.body.style.cursor = ""
                document.body.style.userSelect = ""
                changeActiveTab(-2)
                return
            }
            const clamped = Math.min(newWidth, MAX_WIDTH)
            setPanelWidth(clamped)
            localStorage.setItem(STORAGE_KEY, String(clamped))
        }

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false
                document.body.style.cursor = ""
                document.body.style.userSelect = ""
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [changeActiveTab])

    function addTab(skill: IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(skillDetails.length>=20) addAlert("Failure","There can only be 20 or less skill/effects")
        else dispatch(mode === "id" ? addIdInfoSkill(skill as SkillDetail) : addEgoInfoSkill(skill as SkillDetail))
    }

    function renderSkillPage(skill: IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never, index: number){
        if(!skill) return;
        const shared = { index, collaspPage: () => changeActiveTab(-2) }
        switch(skill.type){
            case "OffenseSkill":
                return <InputOffenseSkillPage {...shared} />
            case "DefenseSkill":
                return <InputDefenseSkillPage {...shared} />
            case "PassiveSkill":
                return <InputPassivePage {...shared} />
            case "CustomEffect":
                return <InputCustomEffectPage {...shared} />
            case "MentalEffect":
                return <InputMentalEffect {...shared} />
        }
    }

    const containerStyle = isPanelOpen && !isMobile ? { width: panelWidth + "px" } : undefined

    return <div className={"input-tab-container"} ref={containerRef} style={containerStyle}>
        <InputTabSide sinnerIcon={sinnerIcon} skillDetails={skillDetails} changeTab={changeActiveTab}
        activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
        {isPanelOpen && <>
            {activeTab === -1
                ? (mode === "id" ? <InputIdInfoStatPage collaspPage={()=>changeActiveTab(-2)}/> : <InputEgoInfoStatPage collaspPage={()=>changeActiveTab(-2)}/>)
                : renderSkillPage(skillDetails[activeTab], activeTab)}
            {!isMobile && <div className="input-tab-resize-handle" onMouseDown={handleMouseDown}></div>}
        </>}
    </div>
}
