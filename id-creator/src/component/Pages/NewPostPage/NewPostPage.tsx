import { useLoginUserContext } from "component/context/LoginUserContext";
import { useLoginMenuContext } from "component/LoginMenu/LoginMenu";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import MainButton from "utils/MainButton/MainButton";
import "./NewPostPage.css";
import TagInput from "utils/TagInput/TagInput";
import TagsContainer from "utils/TagsContainer/TagsContainer";
import { ITag } from "utils/TagList";
import { ISaveFile } from "Interfaces/ISaveFile";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import SearchSaveInput from "./SearchSaveInput/SearchSaveInput";
import Close_icon from "Icons/Close_icon";
import Editor from 'react-simple-wysiwyg';
import { useAlertContext } from "component/context/AlertContext";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";


interface IChoosenSave{
    PreviewUrl:string,
    SaveType:string,
}

export default function NewPostPage():ReactElement{
    const [postName,setPostName] = useState("")
    const [tags,setTags] = useState<ITag[]>([])
    const [saveList,setSaveList] = useState<ISaveFile<IIdInfo|IEgoInfo>[]>([])
    const [choosenSave,setChoosenSave] = useState<IChoosenSave[]>([])
    const [saveMode,setSaveMode] = useState("Identity")
    const [description,setDescription] = useState("")
    const [isPosting,setIsPosting] = useState(false)
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()
    const {addAlert} = useAlertContext()
    const navigate = useNavigate()

    async function createPost(){
        if(!postName) return addAlert("Failure","Post name length must be between 1 and 200")
        if(choosenSave.length<1) return addAlert("Failure","Post must have between 1 and 8 images")
        if(loginUser){
            try {
                setIsPosting(true)
                const uploadTags = tags.map(t=>(t.tagName))
                if(choosenSave.some(s=>s.SaveType==="Identity")&&!tags.some(t=>t.tagName==="Identity")) uploadTags.push("Identity")
                if(choosenSave.some(s=>s.SaveType==="Ego")&&!tags.some(t=>t.tagName==="Ego")) uploadTags.push("Ego")
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Post/create`,{
                    method: "POST",
                    credentials: "include",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body: JSON.stringify({
                        id: uuid(),
                        title:postName,
                        description: description,
                        imagesAttach: choosenSave.map(s=>s.PreviewUrl),
                        userId: loginUser.id,
                        tags: uploadTags
                    })
                })
                const result = await response.json()
                if(!response.ok) addAlert("Failure",result.msg)
                else{
                    navigate("/Post/"+result.response.id)
                }
            } catch (error) {
                console.log(error)
                addAlert("Failure","Something went wrong with the server")
            }
        }
        setIsPosting(false)
    }

    async function searchSave(searchName:string="") {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="Identity"?"SaveIDInfo":"SaveEGOInfo"}?userId=${loginUser.id}&searchName=${searchName}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(response.ok) setSaveList(result.response)
        } catch (error) {
            console.log(error)
            setSaveList([])
        }
    }

    function chooseSave(saveUrl:string){
        if(choosenSave.length<8)setChoosenSave([...choosenSave,{
            PreviewUrl : saveUrl,
            SaveType: saveMode
        }])
    }

    function removeSave(i:number){
        const newChoosenSave = [...choosenSave]
        newChoosenSave.splice(i,1)
        setChoosenSave(newChoosenSave)
    }

    useEffect(()=>{searchSave("")},[saveMode])

    return <div className="page-container post-page">
        {loginUser?<div className="page-content">
            <h1 className="header-txt">Create new post</h1>
            <div className="post-input-container">
                <label htmlFor="post-name">Post Name (Required) {postName.length}/200: </label>
                <input type="text" name="post-name" id="post-name" className="input" placeholder="Enter the post name" value={postName} onChange={(e)=>{if(postName.length<200)setPostName(e.target.value)}}/>
            </div>
            <div className="post-input-container">
                <label htmlFor="tag">Tags {tags.length}/20:</label>
                <TagInput completeFn={(tag)=>{setTags([...new Set([...tags,tag])])}} maxTag={20} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            {tags.length>0&&<TagsContainer tags={tags} deleteTag={(i)=>{
                if(tags.length<20){
                    const newTags = [...tags]
                    newTags.splice(i,1)
                    setTags(newTags)
                }
            }}/>}
            
            <div className="post-input-container">
                <div>
                    <label htmlFor="search-save">Enter ID/EGO you want to add to the post (Required) {choosenSave.length}/8:</label>
                    <div className="post-save-mode-container">
                        <div className="center-element">
                            <label htmlFor="Identity">Identity</label>
                            <input type="radio" id={"Identity"} name="saveMode" value={"Identity"} checked={saveMode==="Identity"} onChange={(e)=>setSaveMode(e.target.value)} />  
                        </div>
                        <div className="center-element">
                            <label htmlFor="Ego">Ego</label>
                            <input type="radio" id={"Ego"} name="saveMode" value={"Ego"} checked={saveMode==="Ego"} onChange={(e)=>setSaveMode(e.target.value)} />    
                        </div>
                    </div> 
                </div>
                <div className="post-save-mode-input-container">
                    <SearchSaveInput saveList={saveList} chooseSave={chooseSave} searchSave={searchSave}/>
                </div>
                <div className="choosen-save-container">
                    {choosenSave.map((save,i)=><div key={i} className="choosen-save-img-container">
                        <div className="remove-btn" onClick={()=>removeSave(i)}>
                            <Close_icon/>
                        </div>
                        <img src={save.PreviewUrl} className="choosen-save-img" alt="preview-img" />
                    </div>)}
                </div>
            </div>
            <div className="post-input-container">
                <label htmlFor="description">Description:</label>
                <Editor className="input post-description-input" name="description" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            {isPosting?<MainButton btnClass="main-button active" component={"Posting..."}/>:
            <MainButton btnClass="main-button" component={"Post"} clickHandler={createPost}/>}
        </div>:
            <div className="page-content">
                Please login to post
                <MainButton btnClass="main-button" component={"Login"} clickHandler={()=>setIsLoginMenuActive(true)}/>
            </div>}
    </div>
}