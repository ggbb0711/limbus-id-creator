'use client'
import React, { ReactElement, useEffect, useState } from 'react';
import 'features/cardCreator/styles/EditorPage.css'
import { indexDB } from 'features/cardCreator/utils/indexDB';
import DragAndDroppableSkillPreviewLayer from 'features/cardCreator/components/card/components/dragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import { EgoCard } from 'features/cardCreator/components/card/EgoCard';
import InputTabContainer from 'features/cardCreator/components/inputTab/inputTabContainer/InputTabContainer';
import ResetMenu from 'features/cardCreator/components/resetMenu/ResetMenu';
import SettingMenu from 'features/cardCreator/components/settingMenu/SettingMenu';
import { EgoInfo } from 'features/cardCreator/types/IEgoInfo';
import CardMakerFooter from 'features/cardCreator/components/cardMakerFooter/CardMakerFooter';
import { useCardDomRef } from 'features/cardCreator/contexts/CardDomRefContext';
import { useAppDispatch, useAppSelector } from 'stores/AppStore';
import { setEgoInfo, resetEgoInfo } from 'features/cardCreator/stores/EgoInfoSlice';
import { setSettingMenuSaveMode } from 'stores/slices/UiSlice';
import CardModeContext from 'features/cardCreator/contexts/CardModeContext';


export default function EgoCardPage():ReactElement{
    const dispatch = useAppDispatch()
    const egoInfoValue = useAppSelector(state => state.egoInfo.value)
    const domRef = useCardDomRef()
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [activeTab,setActiveTab]=useState(-1)

    function changeActiveTab(i:number){
        if(activeTab===i) setActiveTab(-2)
        else setActiveTab(i)
    }

    // Restore the last edited card. The save effect below waits for this, otherwise it would write the
    // default card over the saved one before it's read (effects run twice in dev under Strict Mode).
    const [isRestored,setIsRestored] = useState(false)
    useEffect(()=>{
        let cancelled = false
        indexDB.currEgoSave.toArray().then(arr=>{
            if(cancelled) return
            const lastSave = arr[0]
            if(lastSave){
                dispatch(setEgoInfo(lastSave))
            }
            dispatch(setSettingMenuSaveMode("EGO"))
            setIsRestored(true)
        })
        return ()=>{ cancelled = true }
    },[])

    useEffect(()=>{
        //Save the last change
        if(!isRestored) return
        indexDB.currEgoSave.put(new EgoInfo(egoInfoValue), 1)
    },[isRestored, JSON.stringify(egoInfoValue)])

    return <CardModeContext.Provider value="ego">
        <SettingMenu saveMode="EGO"/>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <InputTabContainer
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={()=>dispatch(resetEgoInfo())} />
            <div className='preview-container'>
                <EgoCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
        <CardMakerFooter/>
    </CardModeContext.Provider>
}
