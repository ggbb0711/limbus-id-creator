import { appConfig } from "config/env.client";
import React, { ReactElement, useState, useRef, useCallback, useEffect } from "react";
import "./InputTabContainer.css"
import { getSkillView } from "features/cardCreator/skills/SkillRegistry";
import { clampPanelWidth, parseSavedWidth } from "features/cardCreator/utils/layout/panelWidth";
import InputIdInfoStatPage from "../inputStatPage/inputIdInfoStatPage/InputIdInfoStatPage";
import InputEgoInfoStatPage from "../inputStatPage/inputEgoInfoStatPage/InputEgoInfoStatPage";
import InputTabSide from "../inputTabSide/InputTabSide";
import { useAddAlert } from "hooks/useAddAlert";
import { useAppDispatch } from "stores/AppStore";
import { CardMode, useCardMode } from "features/cardCreator/contexts/CardModeContext";
import { useCardActions, useCardSelector } from "features/cardCreator/hooks/useCardInfo";
import { SkillDetail } from "features/cardCreator/types/SkillDetail";

const STORAGE_KEY = "inputPanelWidth"

const STAT_PAGES: Record<CardMode, typeof InputIdInfoStatPage> = {
    id: InputIdInfoStatPage,
    ego: InputEgoInfoStatPage,
}

function getSavedWidth(): number {
    return parseSavedWidth(localStorage.getItem(STORAGE_KEY))
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
    const { addSkill } = useCardActions()
    const skillDetails = useCardSelector(info => info.skillDetails)
    const sinnerIcon = useCardSelector(info => info.sinnerIcon)
    const StatPage = STAT_PAGES[mode]
    const addAlert = useAddAlert()

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
            const resize = clampPanelWidth(newWidth)
            if (resize.kind === "close") {
                isDragging.current = false
                document.body.style.cursor = ""
                document.body.style.userSelect = ""
                changeActiveTab(-2)
                return
            }
            setPanelWidth(resize.width)
            localStorage.setItem(STORAGE_KEY, String(resize.width))
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

    function addTab(skill: SkillDetail){
        if(skillDetails.length>=appConfig.limits.card.maxSkills) addAlert("Failure",`There can only be ${appConfig.limits.card.maxSkills} or fewer skills/effects`)
        else dispatch(addSkill(skill))
    }

    function renderSkillPage(skill: SkillDetail | undefined, index: number){
        if(!skill) return;
        const { InputPage } = getSkillView(skill.type)
        return <InputPage key={skill.inputId} index={index} collapsePage={() => changeActiveTab(-2)} />
    }

    const containerStyle = isPanelOpen && !isMobile ? { width: panelWidth + "px" } : undefined

    return <div className={"input-tab-container"} ref={containerRef} style={containerStyle}>
        <InputTabSide sinnerIcon={sinnerIcon} skillDetails={skillDetails} changeTab={changeActiveTab}
        activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
        {isPanelOpen && <>
            {activeTab === -1
                ? <StatPage collapsePage={()=>changeActiveTab(-2)}/>
                : renderSkillPage(skillDetails[activeTab], activeTab)}
            {!isMobile && <div className="input-tab-resize-handle" onMouseDown={handleMouseDown}></div>}
        </>}
    </div>
}
