'use client'
import React, { ReactElement, useState } from 'react';
import 'features/cardCreator/styles/EditorPage.css'
import DragAndDroppableSkillPreviewLayer from 'features/cardCreator/components/card/components/dragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import CardMakerFooter from 'features/cardCreator/components/cardMakerFooter/CardMakerFooter';
import SettingMenu from 'features/cardCreator/components/settingMenu/SettingMenu';
import { IdCard } from 'features/cardCreator/components/card/IdCard';
import { EgoCard } from 'features/cardCreator/components/card/EgoCard';
import InputTabContainer from 'features/cardCreator/components/inputTab/inputTabContainer/InputTabContainer';
import ResetMenu from 'features/cardCreator/components/resetMenu/ResetMenu';
import { useCardDomRef } from 'features/cardCreator/contexts/CardDomRefContext';
import CardModeContext, { CardMode, toSaveMode } from 'features/cardCreator/contexts/CardModeContext';
import { resetCard } from 'features/cardCreator/stores/cardActions';
import { usePersistCurrentCard } from 'features/cardCreator/hooks/usePersistCurrentCard';
import { useAppDispatch } from 'stores/AppStore';
import SectionErrorBoundary from "components/errorBoundary/SectionErrorBoundary";

const CARDS: Record<CardMode, typeof IdCard> = { id: IdCard, ego: EgoCard }

export default function CardEditorPage({ mode }: { mode: CardMode }): ReactElement {
    const dispatch = useAppDispatch()
    const domRef = useCardDomRef()
    const [isResetMenuActive, setResetMenuActive] = useState(false)
    const [activeTab, setActiveTab] = useState(-1)
    const Card = CARDS[mode]

    usePersistCurrentCard(mode)

    function changeActiveTab(i: number) {
        setActiveTab(current => (current === i ? -2 : i))
    }

    return <CardModeContext.Provider value={mode}>
        <SettingMenu saveMode={toSaveMode(mode)}/>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <SectionErrorBoundary context="inputTabs" label="editor panel">
                <InputTabContainer
                    resetBtnHandler={() => setResetMenuActive(active => !active)}
                    activeTab={activeTab}
                    changeActiveTab={changeActiveTab} />
            </SectionErrorBoundary>
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={() => dispatch(resetCard(mode))} />
            <div className='preview-container'>
                <SectionErrorBoundary context="cardPreview" label="card preview">
                    <Card ref={domRef} changeActiveTab={setActiveTab}/>
                </SectionErrorBoundary>
            </div>
        </div>
        <CardMakerFooter/>
    </CardModeContext.Provider>
}
