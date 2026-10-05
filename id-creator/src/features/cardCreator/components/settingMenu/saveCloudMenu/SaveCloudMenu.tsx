import React, { useState } from "react";
import { ReactElement } from "react";
import { ISaveFile } from "types/ISaveFile";
import { createSaveFile } from "utils/createSaveFile";
import { isActiveSkill } from "features/cardCreator/types/SkillDetail";
import { SaveMode } from "features/cardCreator/constants";
import PopUpMenu from "components/popUpMenu/PopUpMenu";
import imageCompression from 'browser-image-compression';
import getImageDimensions from "utils/getImageDimensions";
import base64ToFile from "utils/base64ToFile";
import checkBase64Image from "utils/checkBase64Image";
import "./SaveCloudMenu.css";
import "../SettingMenu.css";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { useLoginMenu } from "hooks/useLoginMenu";
import * as Sentry from "@sentry/nextjs"
import useAlert from "hooks/useAlert";
import formatDateForBackend from "utils/formatDateForBackend";
import { useCardDomRef } from "features/cardCreator/contexts/CardDomRefContext";
import { useAuth } from "hooks/useAuth";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { setIdInfo } from "features/cardCreator/stores/IdInfoSlice";
import { setEgoInfo } from "features/cardCreator/stores/EgoInfoSlice";
import { closeSettingMenu } from "stores/slices/UiSlice";
import {
    useGetSaveListQuery,
    useLazyGetSaveQuery,
    useCreateSaveMutation,
    useUpdateSaveMutation,
    useDeleteSaveMutation,
} from "api/SaveInfoApi";

function SaveCloudTab({saveName,saveDate,previewUrl,deleteSave,loadSave,overwriteSave}:{saveName:string,saveDate:string,previewUrl:string,deleteSave:()=>void,loadSave:()=>void,overwriteSave:()=>void}):ReactElement{
    return <div className="save-cloud-tab">
        <div className="center-element save-cloud-tab-content">
            <img className="preview-img" src={previewUrl} alt="preview-img" />
            <div style={{textAlign:"left"}}>
                <p className="created-time">Updated: {saveDate}</p>
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
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()
    const cardDomRef = useCardDomRef()
    const dispatch = useAppDispatch()

    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const egoInfoValue = useAppSelector(state => state.egoInfo.value)
    const cardData = saveMode === "ID" ? idInfoValue : egoInfoValue

    const { data: saveList = [], isFetching: isLoadingSaveList } = useGetSaveListQuery(
        { userId: loginUser?.id ?? "", searchName: searchSaveName, saveMode },
        { skip: !loginUser }
    )

    const [triggerGetSave, { isFetching: isLoadingSave }] = useLazyGetSaveQuery()
    const [createSaveMutation] = useCreateSaveMutation()
    const [updateSaveMutation] = useUpdateSaveMutation()
    const [deleteSaveMutation, { isLoading: isDeleting }] = useDeleteSaveMutation()

    const isLoadingSaveData = isLoadingSaveList || isLoadingSave || isDeleting || isCreating

    async function createForm(saveFileData: ISaveFile<IIdInfo|IEgoInfo>, domRef: React.RefObject<HTMLDivElement | null>): Promise<FormData> {
        // Loaded on demand: modern-screenshot is only needed when saving
        const { default: TurnRefToImg } = await import("utils/TurnRefToImg")
        const form = new FormData()
        saveFileData.saveTime = formatDateForBackend(new Date())
        const saveData = JSON.parse(JSON.stringify(saveFileData)) as ISaveFile<IIdInfo|IEgoInfo>
        const saveInfo = {...saveData.saveInfo}

        const compressToWebP = (file: File) => imageCompression(file, {
            maxSizeMB: 1,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.7,
        })

        const skillImageTasks = saveInfo.skillDetails.map(async (skill, i) => {
            if(isActiveSkill(skill) && checkBase64Image(skill.skillImage)){
                return { file: await compressToWebP(base64ToFile(skill.skillImage, "new file")), index: i, clear: () => { skill.skillImage = "" } }
            }
            if(skill.type==="CustomEffect" && checkBase64Image(skill.customImg)){
                return { file: await compressToWebP(base64ToFile(skill.customImg, "new file")), index: i, clear: () => { skill.customImg = "" } }
            }
            return null
        })

        const [sinnerIconFile, splashArtFile, imgUrl, ...skillResults] = await Promise.all([
            checkBase64Image(saveInfo.sinnerIcon) ? compressToWebP(base64ToFile(saveInfo.sinnerIcon, "new file")) : Promise.resolve(null),
            checkBase64Image(saveInfo.splashArt)  ? compressToWebP(base64ToFile(saveInfo.splashArt, "new file"))  : Promise.resolve(null),
            TurnRefToImg(domRef),
            ...skillImageTasks
        ])

        if(sinnerIconFile){ form.append("sinnerIcon", sinnerIconFile); saveInfo.sinnerIcon = "" }
        if(splashArtFile){ form.append("splashArtImg", splashArtFile); saveInfo.splashArt = "" }

        const thumbnailImageFile = base64ToFile(imgUrl as string, "new file")
        const {width} = await getImageDimensions(thumbnailImageFile)
        form.append("thumbnailImage", await imageCompression(thumbnailImageFile, {
            maxSizeMB: 1,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.7,
            maxWidthOrHeight: Math.max(1650, Math.floor(width * (2/3)))
        }))

        let formSkillImageIndex = 0
        skillResults.forEach(result => {
            if(result){
                form.append(`SkillImages[${formSkillImageIndex}].Image`, result.file)
                form.append(`SkillImages[${formSkillImageIndex}].Index`, result.index.toString())
                result.clear()
                formSkillImageIndex++
            }
        })
        saveInfo.skillDetails = saveInfo.skillDetails.map((skill, i) => ({ ...skill, index: i })) as typeof saveInfo.skillDetails
        saveData.saveInfo=saveInfo
        form.append("SaveData",JSON.stringify(saveData))
        return form
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
            if(saveMode === "ID"){
                dispatch(setIdInfo(result.saveInfo as IIdInfo))
            } else {
                dispatch(setEgoInfo(result.saveInfo as IEgoInfo))
            }
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
        if(!loginUser) return <button className="main-button create-new-save-btn" onClick={()=>{setIsLoginMenuActive(true)}}>Login</button>
        if(isCreating) return <button className="main-button active create-new-save-btn">{createSaveBtnLoadMsg}</button>
        return <button className="main-button create-new-save-btn" onClick={()=>setNamePopup(true)}>Create a new save</button>
    }

    return <div className="save-cloud-container">
        <div className={`${namePopup?"":"hidden"}`}>
            <PopUpMenu setIsActive={()=>setNamePopup(false)}>
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
            {isLoadingSaveData?<div className="loading-cloud-tab"><div className="loader"></div></div>:<></>}
            <div className="save-menu-list">
                {loginUser?<>
                    {saveList.map(save=><SaveCloudTab key={save.id} saveDate={save.saveTime} saveName={save.name} previewUrl={save.previewImg ?? ""}
                                    deleteSave={()=>deleteSave(save.id)} loadSave={()=>loadSave(save.id)} overwriteSave={()=>overwriteSave(save.id, save.name)}/>)}
                </>:
                    <div className="save-cloud-login-remainder">
                        <p>Please login to save to the cloud</p>
                        <button className="main-button" onClick={()=>{setIsLoginMenuActive(true)}}>Login</button>
                    </div>
                }
            </div>
        </div>
        {loadCreateNewSaveButton()}
    </div>
}
