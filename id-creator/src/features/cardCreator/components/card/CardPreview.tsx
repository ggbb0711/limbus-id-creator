import React, { Dispatch, ReactElement, SetStateAction, forwardRef, useState } from "react";
import './styles/Card.css'
import SkillDetailContainer from "./components/skillDetailContainer/SkillDetailContainer";
import CardZoomShell from "./components/cardZoomShell/CardZoomShell";
import { useAppSelector } from "stores/AppStore";
import { useMoveSkill } from "features/cardCreator/hooks/useMoveSkill";
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext";

interface CardPreviewProps {
    changeActiveTab: Dispatch<SetStateAction<number>>
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ changeActiveTab }, ref): ReactElement => {
    const editor = useCardEditor()
    const info = useAppSelector(editor.selectInfo)
    const [isDragging, setIsDragging] = useState(false)
    const moveSkill = useMoveSkill(changeActiveTab)
    const { PreviewBody } = editor

    const skills = <SkillDetailContainer moveSkill={moveSkill} skillDetails={info.skillDetails} draggingHandler={setIsDragging} changeActiveTab={changeActiveTab}/>

    return (
        <CardZoomShell isDragging={isDragging}>
            <div className="Card" ref={ref}>
                {info.sinnerIcon && <img className="sinner-icon-background" src={info.sinnerIcon} alt="sinner-icon" crossOrigin="anonymous" />}
                <div className="Card-container">
                    <PreviewBody info={info} skills={skills}/>
                </div>
            </div>
        </CardZoomShell>
    )
})

CardPreview.displayName = "CardPreview"

export default CardPreview
