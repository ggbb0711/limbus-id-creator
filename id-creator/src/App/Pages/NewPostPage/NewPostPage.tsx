import { useLoginMenu } from "Hooks/useLoginMenu";
import React, { useState } from "react";
import { ReactElement } from "react";
import "./NewPostPage.css";
import TagInput from "Components/TagInput/TagInput";
import TagsContainer from "Components/TagsContainer/TagsContainer";
import { ITag } from "Utils/TagList";
import SearchSaveInput from "../../../Features/CardCreator/Components/SearchSaveInput/SearchSaveInput";
import CloseIcon from "Assets/Icons/CloseIcon";
import Editor from 'react-simple-wysiwyg';
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import useAlert from "Hooks/useAlert";
import { useCheckAuthQuery } from "Api/AuthApi";
import { useCreatePostMutation } from "Api/PostAPI";

interface IChoosenSave{
    PreviewUrl:string,
    SaveType:string,
}

export default function NewPostPage():ReactElement{
    const [postName,setPostName] = useState("")
    const [tags,setTags] = useState<ITag[]>([])
    const [choosenSave,setChoosenSave] = useState<IChoosenSave[]>([])
    const [saveMode,setSaveMode] = useState("Identity")
    const [description,setDescription] = useState("")
    const {data: loginUser} = useCheckAuthQuery()
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()
    const navigate = useNavigate()

    const [createPost, {isLoading: isPosting}] = useCreatePostMutation()

    async function handleCreatePost(){
        if(isPosting) return
        if(!postName) return addAlert("Failure","Post name length must be between 1 and 200")
        if(choosenSave.length<1) return addAlert("Failure","Post must have between 1 and 8 images")
        if(!loginUser) return
        try {
            const uploadTags = tags.map(t=>(t.tagName))
            if(choosenSave.some(s=>s.SaveType==="Identity")&&!tags.some(t=>t.tagName==="Identity")) uploadTags.push("Identity")
            if(choosenSave.some(s=>s.SaveType==="Ego")&&!tags.some(t=>t.tagName==="Ego")) uploadTags.push("Ego")
            const result = await createPost({
                id: uuid(),
                title: postName,
                description,
                imagesAttach: choosenSave.map(s=>s.PreviewUrl),
                userId: loginUser.id,
                tags: uploadTags,
            }).unwrap()
            navigate("/Post/"+result.id)
        } catch {
            addAlert("Failure","Something went wrong with the server")
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
                    <SearchSaveInput userId={loginUser.id} saveMode={saveMode === "Identity" ? "ID" : "EGO"} chooseSave={chooseSave}/>
                </div>
                <div className="choosen-save-container">
                    {choosenSave.map((save,i)=><div key={i} className="choosen-save-img-container">
                        <div className="remove-btn" onClick={()=>removeSave(i)}>
                            <CloseIcon/>
                        </div>
                        <img src={save.PreviewUrl} className="choosen-save-img" alt="preview-img" />
                    </div>)}
                </div>
            </div>
            <div className="post-input-container">
                <label htmlFor="description">Description:</label>
                <Editor className="input post-description-input" name="description" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <button className={`main-button ${isPosting??"active"}`} onClick={handleCreatePost}>{isPosting?"Posting...":"Post"}</button>
        </div>:
            <div className="page-content">
                Please login to post
                <button className="main-button" onClick={()=>setIsLoginMenuActive(true)}>Login</button>
            </div>}
    </div>
}