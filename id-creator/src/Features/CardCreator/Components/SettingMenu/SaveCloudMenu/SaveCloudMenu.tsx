import React, { useState } from "react";
import { ReactElement } from "react";
import { ISaveFile, SaveFile } from "Types/ISaveFile";
import { IOffenseSkill } from "Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill";
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import { ICustomEffect } from "Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect";
import uuid from "react-uuid";
import PopUpMenu from "Components/PopUpMenu/PopUpMenu";
import imageCompression from 'browser-image-compression';
import getImageDimensions from "Utils/getImageDimensions";
import base64ToFile from "Utils/base64ToFile";
import checkBase64Image from "Utils/checkBase64Image";
import "./SaveCloudMenu.css";
import "../SettingMenu.css";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";
import { useLoginMenu } from "Hooks/useLoginMenu";
import * as Sentry from "@sentry/react"
import useAlert from "Hooks/useAlert";
import TurnRefToImg from "Utils/TurnRefToImg";
import { getDomRef } from "Stores/Slices/ImgDomRefSlice";
import { useCheckAuthQuery } from "Api/AuthApi";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";
import { setEgoInfo } from "Features/CardCreator/Stores/EgoInfoSlice";
import { closeSettingMenu } from "Stores/Slices/UiSlice";
import {
    useGetSaveListQuery,
    useLazyGetSaveQuery,
    useCreateSaveMutation,
    useUpdateSaveMutation,
    useDeleteSaveMutation,
} from "Api/SaveInfoApi";

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

export default function SaveCloudMenu({saveMode}:{saveMode:"ID"|"EGO"}):ReactElement{
    const [createSaveBtnLoadMsg,setCreateSaveBtnLoadMsg] = useState("")
    const [isCreating,setIsCreating] = useState(false)
    const [namePopup,setNamePopup] = useState(false)
    const [searchSaveName,setSearchSaveName] = useState("")
    const [saveName,setSaveName] = useState("New save file")
    const {data: loginUser} = useCheckAuthQuery()
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()
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

    async function createForm(saveFileData: ISaveFile<IIdInfo|IEgoInfo>, domRef: React.MutableRefObject<any>): Promise<FormData> {
        const form = new FormData()
        saveFileData.saveTime = (new Date()).toLocaleString('en-GB')
        const saveData = JSON.parse(JSON.stringify(saveFileData)) as ISaveFile<IIdInfo|IEgoInfo>
        const saveInfo = {...saveData.saveInfo}

        const compressToWebP = (file: File) => imageCompression(file, {
            maxSizeMB: 1,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.7,
        })

        const skillImageTasks = saveInfo.skillDetails.map(async (skill, i) => {
            if(skill.type==="OffenseSkill" && checkBase64Image((skill as IOffenseSkill).skillImage)){
                return { file: await compressToWebP(base64ToFile((skill as IOffenseSkill).skillImage, "new file")), index: i, clear: () => { (saveInfo.skillDetails[i] as IOffenseSkill).skillImage = "" } }
            }
            if(skill.type==="DefenseSkill" && checkBase64Image((skill as IDefenseSkill).skillImage)){
                return { file: await compressToWebP(base64ToFile((skill as IDefenseSkill).skillImage, "new file")), index: i, clear: () => { (saveInfo.skillDetails[i] as IDefenseSkill).skillImage = "" } }
            }
            if(skill.type==="CustomEffect" && checkBase64Image((skill as ICustomEffect).customImg)){
                return { file: await compressToWebP(base64ToFile((skill as ICustomEffect).customImg, "new file")), index: i, clear: () => { (saveInfo.skillDetails[i] as ICustomEffect).customImg = "" } }
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

        skillResults.forEach(result => {
            if(result){ form.append("skillImages", result.file); form.append("imageIndex", result.index.toString()); result.clear() }
        })
        saveData.saveInfo=saveInfo
        form.append("SaveData",JSON.stringify(saveData))
        return form
    }

    async function createNewSaveFile(){
        try {
            setIsCreating(true)
            setCreateSaveBtnLoadMsg("Waiting for save image to load...")
            const saveFileData = new SaveFile(cardData, saveName)
            saveFileData.id = uuid()
            const imgDomRef = getDomRef();
            if(!imgDomRef){
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

    async function overwriteSave(saveId: string){
        try {
            setIsCreating(true)
            setCreateSaveBtnLoadMsg("Waiting for save image to load...")
            const saveFileData = new SaveFile(cardData, saveName)
            saveFileData.id = saveId
            const imgDomRef = getDomRef();
            if(!imgDomRef){
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
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name"
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
            <label htmlFor="saveName">Search: </label>
            <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" value={searchSaveName} onChange={(e)=>setSearchSaveName(e.target.value)}/>
        </div>
        <div className="save-menu-list-container">
            {isLoadingSaveData?<div className="loading-cloud-tab"><div className="loader"></div></div>:<></>}
            <div className="save-menu-list">
                {loginUser?<>
                    {saveList.map(save=><SaveCloudTab key={save.id} saveDate={save.saveTime} saveName={save.saveName} previewUrl={save.previewImg ?? ""}
                                    deleteSave={()=>deleteSave(save.id)} loadSave={()=>loadSave(save.id)} overwriteSave={()=>overwriteSave(save.id)}/>)}
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
