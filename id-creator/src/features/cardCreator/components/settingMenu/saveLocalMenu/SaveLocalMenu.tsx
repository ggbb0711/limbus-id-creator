import { appConfig } from "config/env.client";
import React, { useMemo, useState } from "react";
import "../SettingMenu.css"
import { createSaveFile } from "features/cardCreator/utils/save/createSaveFile";
import { sortSavesByTimeDesc } from "features/cardCreator/utils/save/sortSaves";
import useSaveLocal, { LocalSave } from "features/cardCreator/hooks/useSaveLocal";
import EditIcon from "assets/icons/EditIcon";
import IconButton from "components/ui/iconButton/IconButton";
import ConfirmDialog from "components/ui/confirmDialog/ConfirmDialog";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext";
import formatDisplayDate from "utils/formatDisplayDate";
import SaveNameDialog from "../saveNameDialog/SaveNameDialog";

type NameDialog = { kind: "create" } | { kind: "rename", save: LocalSave }

interface PendingAction {
    kind: "delete" | "overwrite"
    save: LocalSave
}

const defaultSaveName = () => "Save "+new Date().toISOString()

const SaveLocalMenu=({close}:{close: ()=>void})=>{
    const editor = useCardEditor()
    const cardData = useAppSelector(editor.selectInfo)
    const dispatch = useAppDispatch()

    const {saveData,isLoading,deleteSave,createSave,changeSaveName,loadSave,overwriteSave} = useSaveLocal(editor)
    const [nameDialog,setNameDialog] = useState<NameDialog|null>(null)
    const [pendingAction,setPendingAction] = useState<PendingAction|null>(null)
    const isFull = saveData.length>=appConfig.limits.card.localSaveMaxLen

    const submitName = (name:string)=>{
        if(nameDialog?.kind==="rename") changeSaveName(nameDialog.save.id,name)
        else createSave(createSaveFile(cardData,name))
    }

    const confirmAction = ()=>{
        if(!pendingAction) return
        const {kind,save} = pendingAction
        setPendingAction(null)
        if(kind==="delete") deleteSave(save.id)
        else overwriteSave(save.id,cardData)
    }

    const load = async (id:string)=>{
        const save = await loadSave(id)
        if(!save) return
        dispatch(editor.load(save.saveInfo))
        close()
    }

    const sortedSaves = useMemo(
        ()=>sortSavesByTimeDesc(saveData),
        [saveData]
    )

    return<>
        <SaveNameDialog open={nameDialog!==null}
            title={nameDialog?.kind==="rename"?"Rename the save":"Name the new save"}
            submitLabel={nameDialog?.kind==="rename"?"Update":"Create"}
            initialName={nameDialog?.kind==="rename"?nameDialog.save.name:defaultSaveName()}
            onSubmit={submitName}
            onClose={()=>setNameDialog(null)}/>
        <div className="save-menu-list local">
            {sortedSaves.map((data)=>
                <div className={`save-tab center-element-vertically`} key={data.id}>
                    {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                    <p className="created-time">Last updated: {formatDisplayDate(data.updateTime, { withTime: true })}</p>
                    <p className="created-time">Created: {formatDisplayDate(data.saveTime, { withTime: true })}</p>
                    <div className="center-element save-tab-input-container">
                        <p>{data.name}</p>
                        <IconButton label={`Rename ${data.name}`} onClick={()=>setNameDialog({kind:"rename",save:data})}>
                            <EditIcon/>
                        </IconButton>
                    </div>
                    <div className="center-element">
                        <button className="main-button" onClick={()=>setPendingAction({kind:"delete",save:data})}>
                            Delete
                        </button>
                        <button className="main-button" onClick={()=>setPendingAction({kind:"overwrite",save:data})}>
                            Overwrite
                        </button>
                        <button className="main-button" onClick={()=>load(data.id)}>
                            Load
                        </button>
                    </div>
                </div>
            )}
        </div>
        <p>Current local save: {saveData.length}/{appConfig.limits.card.localSaveMaxLen}</p>
        <button className="main-button create-new-save-btn" disabled={isLoading||isFull} onClick={()=>setNameDialog({kind:"create"})}>{isLoading?"Loading...":"Create a new save"}</button>
        {pendingAction && <ConfirmDialog
            message={pendingAction.kind==="delete"
                ? `Delete the local save "${pendingAction.save.name}"? This can't be undone.`
                : `Overwrite the local save "${pendingAction.save.name}" with the current card?`}
            onConfirm={confirmAction}
            onCancel={()=>setPendingAction(null)}
        />}
    </>
}

export {SaveLocalMenu}
