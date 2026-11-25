'use client'
import React, { ReactElement, useState } from 'react';
import 'features/cardCreator/styles/EditorPage.css'
import DragAndDroppableSkillPreviewLayer from 'features/cardCreator/components/card/components/dragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import CardMakerFooter from 'features/cardCreator/components/cardMakerFooter/CardMakerFooter';
import SettingMenu from 'features/cardCreator/components/settingMenu/SettingMenu';
import CardPreview from 'features/cardCreator/components/card/CardPreview';
import InputTabContainer from 'features/cardCreator/components/inputTab/inputTabContainer/InputTabContainer';
import ResetMenu from 'features/cardCreator/components/resetMenu/ResetMenu';
import { useCardDomRef } from 'features/cardCreator/contexts/CardDomRefContext';
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext';
import { CardEditorDefinition } from 'features/cardCreator/editors/CardEditorDefinition';
import { usePersistCurrentCard } from 'features/cardCreator/hooks/usePersistCurrentCard';
import { useAppDispatch, useAppSelector } from 'stores/AppStore';
import { StatusEffectPopupProvider } from 'features/cardCreator/contexts/StatusEffectPopupContext';
import SectionErrorBoundary from "components/errorBoundary/SectionErrorBoundary";
import { ActiveTabContext } from 'features/cardCreator/contexts/ActiveTabContext';

export default function CardEditor({ editor }: { editor: CardEditorDefinition }): ReactElement {
    const dispatch = useAppDispatch()
    const domRef = useCardDomRef()
    const skillDetails = useAppSelector(state => editor.selectInfo(state).skillDetails)
    const [isResetMenuActive, setResetMenuActive] = useState(false)
    const [activeTab, setActiveTab] = useState(-1)

    usePersistCurrentCard(editor)

    function changeActiveTab(i: number) {
        setActiveTab(current => (current === i ? -2 : i))
    }

    return <CardEditorContext.Provider value={editor}>
        <ActiveTabContext.Provider value={setActiveTab}>
        <SettingMenu/>
        <DragAndDroppableSkillPreviewLayer/>
        <StatusEffectPopupProvider skills={skillDetails}>
            <div className={`editor-container`}>
                <SectionErrorBoundary context="inputTabs" label="editor panel">
                    <InputTabContainer
                        resetBtnHandler={() => setResetMenuActive(active => !active)}
                        activeTab={activeTab}
                        changeActiveTab={changeActiveTab} />
                </SectionErrorBoundary>
                <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={() => dispatch(editor.reset())} />
                <div className='preview-container'>
                    <SectionErrorBoundary context="cardPreview" label="card preview">
                        <CardPreview ref={domRef} changeActiveTab={setActiveTab}/>
                    </SectionErrorBoundary>
                </div>
            </div>
        </StatusEffectPopupProvider>
        <CardMakerFooter/>
        </ActiveTabContext.Provider>
    </CardEditorContext.Provider>
}
