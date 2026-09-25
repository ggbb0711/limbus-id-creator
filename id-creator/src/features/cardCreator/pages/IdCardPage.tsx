'use client'
import React, { ReactElement, useEffect, useState } from 'react';
import 'features/cardCreator/styles/EditorPage.css'
import { indexDB } from 'features/cardCreator/utils/indexDB';
import DragAndDroppableSkillPreviewLayer from 'features/cardCreator/components/card/components/dragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import CardMakerFooter from 'features/cardCreator/components/cardMakerFooter/CardMakerFooter';
import SettingMenu from 'features/cardCreator/components/settingMenu/SettingMenu';
import { IdCard } from 'features/cardCreator/components/card/IdCard';
import InputTabContainer from 'features/cardCreator/components/inputTab/inputTabContainer/InputTabContainer';
import ResetMenu from 'features/cardCreator/components/resetMenu/ResetMenu';
import { IdInfo } from 'features/cardCreator/types/IIdInfo';
import { useCardDomRef } from 'features/cardCreator/contexts/CardDomRefContext';
import { useAppDispatch, useAppSelector } from 'stores/AppStore';
import { setIdInfo, resetIdInfo } from 'features/cardCreator/stores/IdInfoSlice';
import { setSettingMenuSaveMode } from 'stores/slices/UiSlice';
import CardModeContext from 'features/cardCreator/contexts/CardModeContext';


export default function IdCardPage():ReactElement{
    const dispatch = useAppDispatch()
    const idInfoValue = useAppSelector(state => state.idInfo.value)
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
        indexDB.currIdSave.toArray().then(arr=>{
            if(cancelled) return
            const lastSave = arr[0]
            if(lastSave){
                dispatch(setIdInfo(lastSave))
            }
            dispatch(setSettingMenuSaveMode("ID"))
            setIsRestored(true)
        })
        return ()=>{ cancelled = true }
    },[])

    useEffect(()=>{
        //Save the last change
        if(!isRestored) return
        indexDB.currIdSave.put(new IdInfo(idInfoValue), 1)
    },[isRestored, JSON.stringify(idInfoValue)])

    return <CardModeContext.Provider value="id">
        <SettingMenu saveMode="ID"/>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <InputTabContainer
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={()=>dispatch(resetIdInfo())} />
            <div className='preview-container'>
                <IdCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
        <CardMakerFooter/>
    </CardModeContext.Provider>
}
