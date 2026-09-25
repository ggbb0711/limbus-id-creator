'use client'
import { useLoginMenu } from "hooks/useLoginMenu";
import React, { useState } from "react";
import { ReactElement } from "react";
import "./NewPostPage.css";
import TagInput from "components/tagInput/TagInput";
import TagsContainer from "components/tagsContainer/TagsContainer";
import { ITag } from "utils/TagList";
import SearchSaveInput from "features/cardCreator/components/searchSaveInput/SearchSaveInput";
import CloseIcon from "assets/icons/CloseIcon";
import Editor from 'react-simple-wysiwyg';
import { useRouter } from "next/navigation";
import useAlert from "hooks/useAlert";
import { useAuth } from "hooks/useAuth";
import { useCreatePostMutation } from "api/PostAPI";
import getApiErrorMessage from "utils/getApiErrorMessage";

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
    const {user: loginUser} = useAuth()
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()
    const router = useRouter()

    const [createPost, {isLoading: isPosting}] = useCreatePostMutation()

    async function handleCreatePost(){
        if(isPosting) return
        if(!postName) return addAlert("Failure","Post name length must be between 1 and 199")
        if(choosenSave.length<1) return addAlert("Failure","Post must have between 1 and 8 images")
        if(!loginUser) return
        try {
            const uploadTags = tags.map(t=>(t.tagName))
            if(choosenSave.some(s=>s.SaveType==="Identity")&&!tags.some(t=>t.tagName==="Identity")) uploadTags.push("Identity")
            if(choosenSave.some(s=>s.SaveType==="Ego")&&!tags.some(t=>t.tagName==="Ego")) uploadTags.push("Ego")
            if(uploadTags.length>21) return addAlert("Failure","Post cannot have more than 21 tags (including the Identity/Ego tag)")
            const result = await createPost({
                title: postName,
                description,
                imagesAttach: choosenSave.map(s=>s.PreviewUrl),
                tags: uploadTags,
            }).unwrap()
            router.push("/post/"+result.id)

            router.refresh()
        } catch (error) {
            addAlert("Failure",getApiErrorMessage(error))
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
                <label htmlFor="post-name">Post Name (Required) {postName.length}/199: </label>
                <input type="text" name="post-name" id="post-name" className="input" placeholder="Enter the post name" maxLength={199} value={postName} onChange={(e)=>setPostName(e.target.value)}/>
            </div>
            <div className="post-input-container">
                <label htmlFor="tag">Tags {tags.length}/20:</label>
                <TagInput completeFn={(tag)=>{setTags([...new Set([...tags,tag])])}} maxTag={20} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            {tags.length>0&&<TagsContainer tags={tags} deleteTag={(i)=>{
                const newTags = [...tags]
                newTags.splice(i,1)
                setTags(newTags)
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