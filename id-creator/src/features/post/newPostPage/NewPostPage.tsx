'use client'
import { canAddTag } from "utils/canAddTag";
import { appConfig } from "config/env.client";
import React, { useState } from "react";
import { ReactElement } from "react";
import "./NewPostPage.css";
import TagInput from "features/post/components/tagInput/TagInput";
import TagsContainer from "features/post/components/tagsContainer/TagsContainer";
import { ITag } from "features/post/utils/TagList";
import { ChosenSave, POST_SAVE_KINDS, PostSaveKind, SAVE_MODE_BY_KIND, addChosenSave, buildUploadTags, validateNewPost } from "features/post/utils/newPost";
import { SearchSaveInput } from "features/cardCreator";
import CloseIcon from "assets/icons/CloseIcon";
import RichTextEditor from "features/post/components/richTextEditor/RichTextEditor";
import { useRouter } from "next/navigation";
import { useAddAlert } from "hooks/useAddAlert";
import { useAuth } from "hooks/useAuth";
import { useCreatePostMutation } from "features/post/api/PostApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";
import IconButton from "components/ui/iconButton/IconButton";
import BusyButton from "components/ui/busyButton/BusyButton";
import Spinner from "components/ui/spinner/Spinner";

const SAVE_SEARCH_ID = "search-save"

export default function NewPostPage(): ReactElement {
    const limits = appConfig.limits.post
    const { maxTitleLength, maxUserTags, maxImages } = limits
    const [postName, setPostName] = useState("")
    const [tags, setTags] = useState<ITag[]>([])
    const [chosenSaves, setChosenSaves] = useState<readonly ChosenSave[]>([])
    const [saveKind, setSaveKind] = useState<PostSaveKind>("Identity")
    const [description, setDescription] = useState("")
    const { user: loginUser, isInitializing } = useAuth()
    const addAlert = useAddAlert()
    const router = useRouter()

    const [createPost, { isLoading: isPosting }] = useCreatePostMutation()

    async function handleCreatePost() {
        if (isPosting) return
        const invalid = validateNewPost({ title: postName, saves: chosenSaves }, limits)
        if (invalid) return addAlert("Failure", invalid)
        const uploadTags = buildUploadTags(tags, chosenSaves, maxUserTags)
        if ("error" in uploadTags) return addAlert("Failure", uploadTags.error)
        try {
            const result = await createPost({
                title: postName.trim(),
                description,
                imagesAttach: chosenSaves.map(save => save.previewUrl),
                tags: uploadTags.tags,
            }).unwrap()
            router.push(`/post/${encodeURIComponent(result.id)}`)
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error))
        }
    }

    function chooseSave(previewUrl: string) {
        setChosenSaves(saves => addChosenSave(saves, { previewUrl, kind: saveKind }, maxImages))
    }

    function removeSave(previewUrl: string) {
        setChosenSaves(saves => saves.filter(save => save.previewUrl !== previewUrl))
    }

    if (isInitializing) return <div className="page-container post-page">
        <div className="page-content center-element-vertically"><Spinner/></div>
    </div>

    return <div className="page-container post-page">
        {loginUser ? <div className="page-content">
            <h1 className="header-txt">Create new post</h1>
            <div className="post-input-container">
                <label htmlFor="post-name">Post Name (Required) {postName.length}/{maxTitleLength}: </label>
                <input type="text" name="post-name" id="post-name" className="input" placeholder="Enter the post name" maxLength={maxTitleLength} value={postName} onChange={(e) => setPostName(e.target.value)}/>
            </div>
            <div className="post-input-container">
                <label htmlFor="tag">Tags {tags.length}/{maxUserTags}:</label>
                <TagInput completeFn={(tag) => { if (canAddTag(tags, tag, maxUserTags)) setTags([...tags, tag]) }} maxTag={maxUserTags} selectedCount={tags.length} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            {tags.length > 0 && <TagsContainer tags={tags} deleteTag={(i) => setTags(tags.filter((_, index) => index !== i))}/>}

            <div className="post-input-container">
                <div>
                    <label htmlFor={SAVE_SEARCH_ID}>Enter ID/EGO you want to add to the post (Required) {chosenSaves.length}/{maxImages}:</label>
                    <div className="post-save-mode-container" role="radiogroup" aria-label="Save type">
                        {POST_SAVE_KINDS.map(kind =>
                            <div className="center-element" key={kind}>
                                <label htmlFor={kind}>{kind}</label>
                                <input type="radio" id={kind} name="saveMode" value={kind} checked={saveKind === kind} onChange={() => setSaveKind(kind)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="post-save-mode-input-container">
                    <SearchSaveInput userId={loginUser.id} saveMode={SAVE_MODE_BY_KIND[saveKind]} chooseSave={chooseSave} inputId={SAVE_SEARCH_ID}/>
                </div>
                <div className="choosen-save-container">
                    {chosenSaves.map((save, i) => <div key={save.previewUrl} className="choosen-save-img-container">
                        <IconButton className="remove-btn" label={`Remove image ${i + 1}`} onClick={() => removeSave(save.previewUrl)}>
                            <CloseIcon/>
                        </IconButton>
                        <img src={save.previewUrl} className="choosen-save-img" alt={`Chosen ${save.kind} ${i + 1}`} />
                    </div>)}
                </div>
            </div>
            <div className="post-input-container">
                <p>Description:</p>
                <RichTextEditor className="post-description-input" id="description" label="Description" value={description} onChange={setDescription} toolbar/>
            </div>
            <BusyButton busy={isPosting} busyText="Posting..." onClick={handleCreatePost}>Post</BusyButton>
        </div> :
            <div className="page-content">
                Please login to post
                <LoginPromptButton/>
            </div>}
    </div>
}
