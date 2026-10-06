import React, { useState } from "react";
import { ReactElement } from "react";
import { ISaveFile } from "features/cardCreator/types/ISaveFile";
import { createSaveFile } from "features/cardCreator/utils/save/createSaveFile";
import { SaveImageError, prepareCloudSaveForm } from "features/cardCreator/utils/save/prepareCloudSave";
import ConfirmDialog from "components/ui/confirmDialog/ConfirmDialog";
import getApiErrorMessage from "api/getApiErrorMessage";
import { useApiErrorAlert } from "hooks/useApiErrorAlert";
import { reportError } from "utils/reportError";
import { SaveMode } from "features/cardCreator/constants";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import "./SaveCloudMenu.css";
import "../SettingMenu.css";
import { CardInfo } from "features/cardCreator/types/CardInfo";
import { useAddAlert } from "hooks/useAddAlert";
import { useCardDomRef } from "features/cardCreator/contexts/CardDomRefContext";
import { useAuth } from "hooks/useAuth";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { loadCard } from "features/cardCreator/stores/cardActions";
import { selectCard } from "features/cardCreator/hooks/useCardInfo";
import { toCardMode } from "features/cardCreator/contexts/CardModeContext";
import { closeSettingMenu } from "features/cardCreator/stores/SettingMenuSlice";
import Spinner from "components/ui/spinner/Spinner";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";
import {
    useGetSaveListQuery,
    useLazyGetSaveQuery,
    useCreateSaveMutation,
    useUpdateSaveMutation,
    useDeleteSaveMutation,
} from "features/cardCreator/api/SaveInfoApi";
import formatDisplayDate from "utils/formatDisplayDate";
import BusyButton from "components/ui/busyButton/BusyButton";

function SaveCloudTab({saveName,saveDate,previewUrl,deleteSave,loadSave,overwriteSave}:{saveName:string,saveDate:string,previewUrl:string,deleteSave:()=>void,loadSave:()=>void,overwriteSave:()=>void}):ReactElement{
    return <div className="save-cloud-tab">
        <div className="center-element save-cloud-tab-content">
            <img className="preview-img" src={previewUrl} alt="preview-img" />
            <div style={{textAlign:"left"}}>
                <p className="created-time">Updated: {formatDisplayDate(saveDate, { withTime: true })}</p>
                <p>{saveName}</p>
            </div>
        </div>
        <div className="center-element save-cloud-tab-button-container">
            <button className="main-button" onClick={deleteSave}>
                Delete
            </button>
            <button className="main-button" onClick={overwriteSave}>
                Overwrite
            </button>
            <button className="main-button" onClick={loadSave}>
                Load
            </button>
        </div>
    </div>
}

interface PendingAction {
    kind: "delete" | "overwrite"
    save: Pick<ISaveFile<CardInfo>, "id" | "name">
}

export default function SaveCloudMenu({saveMode}:{saveMode:SaveMode}):ReactElement{
    const [createSaveBtnLoadMsg,setCreateSaveBtnLoadMsg] = useState("")
    const [isCreating,setIsCreating] = useState(false)
    const [namePopup,setNamePopup] = useState(false)
    const [searchSaveName,setSearchSaveName] = useState("")
    const [saveName,setSaveName] = useState("New save file")
    const {user: loginUser} = useAuth()
    const addAlert = useAddAlert()
    const cardDomRef = useCardDomRef()
    const dispatch = useAppDispatch()

    const cardMode = toCardMode(saveMode)
    const cardData = useAppSelector(state => selectCard(state, cardMode))

    const { data: saveList = [], isFetching: isLoadingSaveList, error: saveListError } = useGetSaveListQuery(
        { userId: loginUser?.id ?? "", searchName: searchSaveName, saveMode },
        { skip: !loginUser }
    )
    useApiErrorAlert(saveListError, "Couldn't load your cloud saves")
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

    const [triggerGetSave, { isFetching: isLoadingSave }] = useLazyGetSaveQuery()
    const [createSaveMutation] = useCreateSaveMutation()
    const [updateSaveMutation] = useUpdateSaveMutation()
    const [deleteSaveMutation, { isLoading: isDeleting }] = useDeleteSaveMutation()

    const isLoadingSaveData = isLoadingSaveList || isLoadingSave || isDeleting || isCreating

    function reportSaveFailure(error: unknown, context: string, fallback: string) {
        if (error instanceof SaveImageError) {
            reportError(error, { context, extra: { assets: error.assets, causes: error.causes.map(cause => String(cause)), saveMode } })
            addAlert("Failure", `${error.message}. Please check or replace these images.`)
            return
        }
        addAlert("Failure", getApiErrorMessage(error, fallback))
    }

    async function runSave(message: string, save: () => Promise<void>) {
        if (!cardDomRef.current) {
            addAlert("Failure", "ERROR: Cannot find reference for the id/ego sheet")
            return
        }
        setIsCreating(true)
        setCreateSaveBtnLoadMsg(message)
        try {
            await save()
        } finally {
            setIsCreating(false)
            setCreateSaveBtnLoadMsg("")
        }
    }

    function createNewSaveFile() {
        return runSave("Waiting for save image to load...", async () => {
            try {
                const form = await prepareCloudSaveForm(createSaveFile(cardData, saveName), cardDomRef)
                setCreateSaveBtnLoadMsg("Creating new save")
                await createSaveMutation({ saveMode, form }).unwrap()
                addAlert("Success", "Save created successfully")
            } catch (error) {
                reportSaveFailure(error, "cloudSave.create", "Couldn't create the save")
            }
        })
    }

    function overwriteSave(saveId: string, existingName: string) {
        return runSave("Waiting for save image to load...", async () => {
            try {
                const form = await prepareCloudSaveForm({ ...createSaveFile(cardData, existingName), id: saveId }, cardDomRef)
                setCreateSaveBtnLoadMsg("Overwriting save...")
                await updateSaveMutation({ saveMode, form }).unwrap()
                addAlert("Success", "Save updated successfully")
            } catch (error) {
                reportSaveFailure(error, "cloudSave.overwrite", "Couldn't overwrite the save")
            }
        })
    }

    async function deleteSave(saveId: string) {
        try {
            await deleteSaveMutation({ saveMode, saveId }).unwrap()
            addAlert("Success", "Deleted")
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error, "Couldn't delete the save"))
        }
    }

    async function loadSave(saveId: string) {
        try {
            const result = await triggerGetSave({ saveId, saveMode }).unwrap()
            dispatch(loadCard(cardMode, result.saveInfo))
            dispatch(closeSettingMenu())
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error, "Couldn't load the save"))
        }
    }

    function confirmAction() {
        if (!pendingAction) return
        const { kind, save } = pendingAction
        setPendingAction(null)
        if (kind === "delete") deleteSave(save.id)
        else overwriteSave(save.id, save.name)
    }

    const loadCreateNewSaveButton = ()=>{
        if(!loginUser) return <LoginPromptButton className="main-button create-new-save-btn"/>
        return <BusyButton busy={isCreating} busyText={createSaveBtnLoadMsg} className="main-button create-new-save-btn" onClick={()=>setNamePopup(true)}>Create a new save</BusyButton>
    }

    return <div className="save-cloud-container">
        <div>
            <PopUpMenu open={namePopup} label="Name the new save" onClose={()=>setNamePopup(false)}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="newCloudSaveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="newCloudSaveName" id="newCloudSaveName" type="text" placeholder="Save name"
                    value={saveName}
                    onChange={(e)=>{
                        setSaveName(e.target.value)
                    }}/>
                    <button className="main-button create-new-save-btn" onClick={()=>{
                        createNewSaveFile()
                        setNamePopup(false)
                    }}>
                        Create
                    </button>
                </div>
            </PopUpMenu>
        </div>
        <div >
            <label htmlFor="searchCloudSaveName">Search: </label>
            <input className="input save-cloud-name-input" name="searchCloudSaveName" id="searchCloudSaveName" type="text" placeholder="Save name" value={searchSaveName} onChange={(e)=>setSearchSaveName(e.target.value)}/>
        </div>
        <div className="save-menu-list-container">
            {isLoadingSaveData?<div className="loading-cloud-tab"><Spinner/></div>:<></>}
            <div className="save-menu-list">
                {loginUser?<>
                    {saveList.map(save=><SaveCloudTab key={save.id} saveDate={save.saveTime} saveName={save.name} previewUrl={save.previewImg ?? ""}
                                    deleteSave={()=>setPendingAction({ kind: "delete", save })} loadSave={()=>loadSave(save.id)} overwriteSave={()=>setPendingAction({ kind: "overwrite", save })}/>)}
                </>:
                    <div className="save-cloud-login-remainder">
                        <p>Please login to save to the cloud</p>
                        <LoginPromptButton/>
                    </div>
                }
            </div>
        </div>
        {loadCreateNewSaveButton()}
        {pendingAction && <ConfirmDialog
            message={pendingAction.kind === "delete"
                ? `Delete the cloud save "${pendingAction.save.name}"? This can't be undone.`
                : `Overwrite the cloud save "${pendingAction.save.name}" with the current card?`}
            onConfirm={confirmAction}
            onCancel={() => setPendingAction(null)}
        />}
    </div>
}
