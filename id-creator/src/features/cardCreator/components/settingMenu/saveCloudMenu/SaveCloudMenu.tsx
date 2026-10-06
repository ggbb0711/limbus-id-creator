import { appConfig } from "config/env.client";
import React, { useState } from "react";
import { ReactElement } from "react";
import { ISaveFile } from "features/cardCreator/types/ISaveFile";
import { createSaveFile } from "features/cardCreator/utils/save/createSaveFile";
import { buildSaveFormData, collectBase64Images } from "features/cardCreator/utils/save/cloudSaveForm";
import { SaveMode } from "features/cardCreator/constants";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import imageCompression from 'browser-image-compression';
import getImageDimensions from "features/cardCreator/utils/image/getImageDimensions";
import base64ToFile from "features/cardCreator/utils/image/base64ToFile";
import "./SaveCloudMenu.css";
import "../SettingMenu.css";
import { CardInfo } from "features/cardCreator/types/CardInfo";
import * as Sentry from "@sentry/nextjs"
import { useAddAlert } from "hooks/useAddAlert";
import formatDateForBackend from "features/cardCreator/utils/save/formatDateForBackend";
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

    const { data: saveList = [], isFetching: isLoadingSaveList } = useGetSaveListQuery(
        { userId: loginUser?.id ?? "", searchName: searchSaveName, saveMode },
        { skip: !loginUser }
    )

    const [triggerGetSave, { isFetching: isLoadingSave }] = useLazyGetSaveQuery()
    const [createSaveMutation] = useCreateSaveMutation()
    const [updateSaveMutation] = useUpdateSaveMutation()
    const [deleteSaveMutation, { isLoading: isDeleting }] = useDeleteSaveMutation()

    const isLoadingSaveData = isLoadingSaveList || isLoadingSave || isDeleting || isCreating

    async function createForm(saveFileData: ISaveFile<CardInfo>, domRef: React.RefObject<HTMLDivElement | null>): Promise<FormData> {
        const { default: TurnRefToImg } = await import("features/cardCreator/utils/image/TurnRefToImg")
        const saveData = { ...saveFileData, saveTime: formatDateForBackend(new Date()) }
        const { images, stripped } = collectBase64Images(saveData.saveInfo)

        const compressToWebP = (file: File, maxWidthOrHeight?: number) => imageCompression(file, {
            maxSizeMB: appConfig.image.compressMaxSizeMB,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: appConfig.image.webpQuality,
            ...(maxWidthOrHeight ? { maxWidthOrHeight } : {}),
        })

        const [screenshot, ...compressed] = await Promise.all([
            TurnRefToImg(domRef),
            ...images.map(image => compressToWebP(base64ToFile(image.dataUrl, "new file"))),
        ])

        const thumbnailFile = base64ToFile(screenshot, "new file")
        const { width } = await getImageDimensions(thumbnailFile)
        const thumbnail = await compressToWebP(thumbnailFile, Math.max(appConfig.image.compressMinDimension, Math.floor(width * (2/3))))

        const files = images.map((image, i) => ({ target: image.target, file: compressed[i] }))
        return buildSaveFormData({ ...saveData, saveInfo: stripped }, thumbnail, files)
    }

    async function createNewSaveFile(){
        try {
            setIsCreating(true)
            setCreateSaveBtnLoadMsg("Waiting for save image to load...")
            const saveFileData = createSaveFile(cardData, saveName)
            const imgDomRef = cardDomRef;
            if(!imgDomRef.current){
                addAlert("Failure","ERROR: Cannot find reference for the id/ego sheet");
                return;
            }
            let form;
            try {
                form = await createForm(saveFileData, imgDomRef);
            } catch (error) {
                Sentry.captureException({ saveFileData, error })
                addAlert("Failure","ERROR: Missing asset detected. Please look for and update the missing asset.");
                return;
            }
            setCreateSaveBtnLoadMsg("Creating new save")
            await createSaveMutation({ saveMode, form }).unwrap()
            addAlert("Success","Save created successfully")
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        } finally {
            setIsCreating(false)
            setCreateSaveBtnLoadMsg("")
        }
    }

    async function deleteSave(saveId: string){
        try {
            await deleteSaveMutation({ saveMode, saveId }).unwrap()
            addAlert("Success","Deleted")
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
    }

    async function loadSave(saveId: string){
        try {
            const result = await triggerGetSave({ saveId, saveMode }).unwrap()
            dispatch(loadCard(cardMode, result.saveInfo))
            dispatch(closeSettingMenu())
        } catch(error){
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
    }

    async function overwriteSave(saveId: string, existingName: string){
        try {
            setIsCreating(true)
            setCreateSaveBtnLoadMsg("Waiting for save image to load...")
            const saveFileData = { ...createSaveFile(cardData, existingName), id: saveId }
            const imgDomRef = cardDomRef;
            if(!imgDomRef.current){
                addAlert("Failure","ERROR: Cannot find reference for the id/ego sheet");
                return;
            }
            const form = await createForm(saveFileData, imgDomRef)
            setCreateSaveBtnLoadMsg("Overwriting save...")
            await updateSaveMutation({ saveMode, form }).unwrap()
            addAlert("Success","Save updated successfully")
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        } finally {
            setIsCreating(false)
            setCreateSaveBtnLoadMsg("")
        }
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
                                    deleteSave={()=>deleteSave(save.id)} loadSave={()=>loadSave(save.id)} overwriteSave={()=>overwriteSave(save.id, save.name)}/>)}
                </>:
                    <div className="save-cloud-login-remainder">
                        <p>Please login to save to the cloud</p>
                        <LoginPromptButton/>
                    </div>
                }
            </div>
        </div>
        {loadCreateNewSaveButton()}
    </div>
}
