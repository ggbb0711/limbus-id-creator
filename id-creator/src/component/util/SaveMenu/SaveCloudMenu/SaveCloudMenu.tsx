import { useRefDownloadContext } from "component/context/ImgUrlContext";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./SaveCloudMenu.css"
import "../SaveMenu.css"
import MainButton from "utils/MainButton/MainButton";
import { useLoginUserContext } from "component/context/LoginUserContext";
import { useLoginMenuContext } from "component/util/LoginMenu/LoginMenu";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import { IIdInfo } from "Interfaces/IIdInfo";
import { ISaveFile } from "Interfaces/ISaveFile";
import checkBase64Image from "utils/Functions/checkBase64Image";
import base64ToFile from "utils/Functions/base64ToFile";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IIsLoading } from "Interfaces/Utils/IIsLoading";
import uuid from "react-uuid";
import { useAlertContext } from "component/context/AlertContext";
import SaveCloudTab from "./SaveCloudTab";
import PopUpMenu from "utils/PopUpMenu/PopUpMenu";

export default function SaveCloudMenu({isActive,setIsActive,saveMode,saveObjInfoValue,loadObjInfoValueCb,setSaveObjInfoValue}:{
    isActive:boolean,
    setIsActive:(a:boolean)=>void,
    saveMode:string,
    saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>,
    setSaveObjInfoValue:React.Dispatch<React.SetStateAction<ISaveFile<IIdInfo | IEgoInfo>>>,
    loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>}):ReactElement{
    const {imgUrl,setImgUrlState} = useRefDownloadContext()
    const [createSaveBtnLoadState,setCreateSaveBtnLoadState] = useState<IIsLoading>({loadingMessage:"",isLoading:false})
    const [isLoadingSaveData,setIsLoadingSaveData] = useState(false)
    const [saveList,setSaveList] = useState([])
    const [namePopup,setNamePopup] = useState(false)
    const [searchSaveName,setSearchSaveName] = useState("")
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()
    const {addAlert} = useAlertContext()

    async function createForm (saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>):Promise<FormData>{
        const form = new FormData()
        //Deep copy
        const saveData = JSON.parse(JSON.stringify(saveObjInfoValue))
        const saveInfo = {...saveData.saveInfo}
        //Check all of the field that can contain base64 string and convert them to file
        //Then remove the string in the object to send them to the backend quicker
        if(checkBase64Image(saveInfo.sinnerIcon)){
            form.append("sinnerIcon",base64ToFile(saveInfo.sinnerIcon,"new file"))
            saveInfo.sinnerIcon = ""
        }

        if(checkBase64Image(saveInfo.splashArt)){
            form.append("splashArtImg",base64ToFile(saveInfo.splashArt,"new file"))
            saveInfo.splashArt = ""
        }

        form.append("thumbnailImage",base64ToFile(await setImgUrlState(),"new file"))

        saveInfo.skillDetails.forEach((skill,i)=>{
            if(skill.type==="OffenseSkill"){
                if(checkBase64Image((skill as IOffenseSkill).skillImage)){
                    form.append("skillImages",base64ToFile((skill as IOffenseSkill).skillImage,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as IOffenseSkill).skillImage=""
                }
            }
            if(skill.type==="DefenseSkill"){
                if(checkBase64Image((skill as IDefenseSkill).skillImage)){
                    form.append("skillImages",base64ToFile((skill as IDefenseSkill).skillImage,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as IDefenseSkill).skillImage=""
                }
            }
            if(skill.type==="CustomEffect"){
                if(checkBase64Image((skill as ICustomEffect).customImg)){
                    form.append("skillImages",base64ToFile((skill as ICustomEffect).customImg,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as ICustomEffect).customImg=""
                }
            }
        })
        saveData.saveInfo=saveInfo
        form.append("SaveData",JSON.stringify(saveData))

        //Log all form data
        // for (let [key, value] of form.entries()) {
        //     console.log(key+":")
        //     console.log(value)
        // }

        return form
    }

    async function createNewSaveFile(){
        try {
            setIsLoadingSaveData(true)
            setCreateSaveBtnLoadState({loadingMessage:"Waiting for save image to load...",isLoading:true})
            saveObjInfoValue.id = uuid()
            const form = await createForm(saveObjInfoValue)
            setCreateSaveBtnLoadState({loadingMessage:"Creating new save",isLoading:true})
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/create`,{
                method: "POST",
                credentials: "include",
                body:form
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{
                addAlert("Success",result.msg)
                loadSaveList()
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        } 
        setCreateSaveBtnLoadState({loadingMessage:"",isLoading:false})
        setIsLoadingSaveData(false)
    }

    async function deleteSave(saveId:string){
        try {
            setIsLoadingSaveData(true)
            const req = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/delete`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(saveId)
            })
            const res = await req.json()
            if(!req.ok) addAlert("Failure",res.msg)
            else{ 
                loadSaveList()
                addAlert("Success","Deleted")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function loadSaveList(){
        try {
            setIsLoadingSaveData(true)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}?userId=${loginUser.id}&searchName=${searchSaveName}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else setSaveList(result.response)
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function loadSave(SaveId:String){
        try{
            setIsLoadingSaveData(true)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/${SaveId}?includeSkill=true`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{ 
                loadObjInfoValueCb(result.response.saveInfo)
                setIsActive(false)
            }
        }
        catch(error){
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function overwriteSave(SaveId:string){
        try {
            setIsLoadingSaveData(true)
            setCreateSaveBtnLoadState({loadingMessage:"Waiting for save image to load...",isLoading:true})
            saveObjInfoValue.id = SaveId
            const form = await createForm(saveObjInfoValue)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/update`,{
                credentials: "include",
                method: "POST",
                body:form
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{ 
                loadSaveList()
                addAlert("Success",result.msg)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    const loadCreateNewSaveButton = ()=>{
        if(!loginUser) return <MainButton component={"Login"} btnClass="main-button create-new-save-btn" clickHandler={()=>{setIsLoginMenuActive(true)}}/>
        if(createSaveBtnLoadState.isLoading) return <MainButton component={createSaveBtnLoadState.loadingMessage} btnClass={"main-button active create-new-save-btn"}/>
        return <MainButton component={"Create a new save"} btnClass={"main-button create-new-save-btn"} clickHandler={()=>setNamePopup(true)}/>
    }

    useEffect(()=>{
        if(loginUser)loadSaveList()
    },[saveMode,loginUser,searchSaveName])


    return <div className="save-cloud-container">
        <div className={`${namePopup?"":"hidden"}`}>
            <PopUpMenu setIsActive={()=>setNamePopup(false)}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" 
                    value={saveObjInfoValue.saveName} 
                    onChange={(e)=>{
                        setSaveObjInfoValue({...saveObjInfoValue,saveName:e.target.value})
                    }}/>
                    <MainButton component={"Create"} btnClass={"main-button create-new-save-btn"} clickHandler={()=>{
                        createNewSaveFile()
                        setNamePopup(false)
                    }}/>
                </div>
            </PopUpMenu>
        </div>
        <div >
            <label htmlFor="saveName">Search: </label>
            <input className="input save-cloud-name-input" name="search-save-name" id="search-save-name" type="text" placeholder="Save name" value={searchSaveName} onChange={(e)=>setSearchSaveName(e.target.value)}/>
        </div>
        <div className="save-menu-list-container">
            {isLoadingSaveData?<div className="loading-cloud-tab"><div className="loader"></div></div>:<></>}
            <div className="save-menu-list">
                {loginUser?<>
                    {saveList.map(save=><SaveCloudTab key={save.id} saveDate={save.saveTime} saveName={save.saveName} previewUrl={save.previewImg}
                                    deleteSave={()=>deleteSave(save.id)} loadSave={()=>loadSave(save.id)} overwriteSave={()=>overwriteSave(save.id)}/>)}
                </>:
                    <div className="save-cloud-login-remainder">
                        <p>Please login to save to the cloud</p>
                        <MainButton component={"Login"} btnClass={"main-button"} clickHandler={()=>{setIsLoginMenuActive(true)}} />
                    </div>
                }
            </div>
        </div>
        {loadCreateNewSaveButton()}
    </div>
}