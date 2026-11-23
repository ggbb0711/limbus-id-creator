'use client'
import { canAddTag } from "utils/canAddTag";
import { appConfig } from "config/env.client";
import React, { useState } from "react";
import { ReactElement } from "react";
import "./NewPostPage.css";
import TagInput from "features/post/components/tagInput/TagInput";
import TagsContainer from "features/post/components/tagsContainer/TagsContainer";
import { ITag } from "features/post/utils/TagList";
import { ChosenSave, POST_SAVE_KINDS, PostSaveKind, SAVE_MODE_BY_KIND, addChosenSave, buildUploadTags, canRemoveSave, chosenSaveKey, chosenSavesFromPost, replaceChosenSave, toCardRequests, userTagsFromPost, validateNewPost } from "features/post/utils/newPost";
import { SearchSaveInput } from "features/cardCreator";
import CloseIcon from "assets/icons/CloseIcon";
import RichTextEditor from "features/post/components/richTextEditor/RichTextEditor";
import { useRouter } from "next/navigation";
import { useAddAlert } from "hooks/useAddAlert";
import { useAuth } from "hooks/useAuth";
import { useCreatePostMutation, useUpdatePostMutation } from "features/post/api/PostApi";
import { revalidatePost } from "features/post/api/server/revalidatePost";
import getApiErrorMessage from "api/getApiErrorMessage";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";
import IconButton from "components/ui/iconButton/IconButton";
import BusyButton from "components/ui/busyButton/BusyButton";
import Spinner from "components/ui/spinner/Spinner";
import { IPost } from "features/post/types/IPost";
import ChosenSaveActions from "./ChosenSaveActions";

const SAVE_SEARCH_ID = "search-save"

export default function NewPostPage({ post }: { post?: IPost }): ReactElement {
    const limits = appConfig.limits.post
    const { maxTitleLength, maxUserTags, maxImages } = limits
    const isEditing = post !== undefined
    const [postName, setPostName] = useState(post?.title ?? "")
    const [tags, setTags] = useState<ITag[]>(() => (post ? userTagsFromPost(post.tags) : []))
    const [chosenSaves, setChosenSaves] = useState<readonly ChosenSave[]>(() => (post ? chosenSavesFromPost(post) : []))
    const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
    const [saveKind, setSaveKind] = useState<PostSaveKind>("Identity")
    const [description, setDescription] = useState(post?.description ?? "")
    const { user: loginUser, isInitializing } = useAuth()
    const addAlert = useAddAlert()
    const router = useRouter()

    const [createPost, { isLoading: isPosting }] = useCreatePostMutation()
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
    const isBusy = isPosting || isUpdating

    async function submit(uploadTags: string[]) {
        if (post) {
            await updatePost({ id: post.id, body: { description, tags: uploadTags, cards: toCardRequests(chosenSaves) } }).unwrap()
            await revalidatePost(post.id, post.userId)
            return post.id
        }
        const result = await createPost({
            title: postName.trim(),
            description,
            cards: toCardRequests(chosenSaves).flatMap(card => ("saveId" in card ? [card] : [])),
            tags: uploadTags,
        }).unwrap()
        return result.id
    }

    async function handleSubmit() {
        if (isBusy) return
        const invalid = validateNewPost({ title: postName, saves: chosenSaves }, limits)
        if (invalid) return addAlert("Failure", invalid)
        const uploadTags = buildUploadTags(tags, chosenSaves, maxUserTags)
        if ("error" in uploadTags) return addAlert("Failure", uploadTags.error)
        try {
            const id = await submit(uploadTags.tags)
            router.push(`/post/${encodeURIComponent(id)}`)
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error))
        }
    }

    function chooseSave({ id, previewUrl }: { id: string, previewUrl: string }) {
        const picked: ChosenSave = { saveId: id, previewUrl, kind: saveKind }
        if (replacingIndex !== null) {
            setChosenSaves(saves => replaceChosenSave(saves, replacingIndex, picked))
            setReplacingIndex(null)
            return
        }
        setChosenSaves(saves => addChosenSave(saves, picked, maxImages))
    }

    function removeSave(index: number) {
        setChosenSaves(saves => saves.filter((_, i) => i !== index))
        setReplacingIndex(null)
    }

    if (isInitializing) return <div className="page-container post-page">
        <div className="page-content center-element-vertically"><Spinner/></div>
    </div>

    const canRemove = !isEditing || canRemoveSave(chosenSaves)

    return <div className="page-container post-page">
        {loginUser ? <div className="page-content">
            <h1 className="header-txt">{isEditing ? "Edit post" : "Create new post"}</h1>
            <div className="post-input-container">
                {isEditing ? <>
                    <label htmlFor="post-name">Post Name:</label>
                    <input type="text" name="post-name" id="post-name" className="input" value={postName} readOnly aria-describedby="post-name-hint"/>
                    <p id="post-name-hint" className="post-input-hint">The post name can&apos;t be changed after posting.</p>
                </> : <>
                    <label htmlFor="post-name">Post Name (Required) {postName.length}/{maxTitleLength}: </label>
                    <input type="text" name="post-name" id="post-name" className="input" placeholder="Enter the post name" maxLength={maxTitleLength} value={postName} onChange={(e) => setPostName(e.target.value)}/>
                </>}
            </div>
            <div className="post-input-container">
                <label htmlFor="tag">Tags {tags.length}/{maxUserTags}:</label>
                <TagInput completeFn={(tag) => { if (canAddTag(tags, tag, maxUserTags)) setTags([...tags, tag]) }} maxTag={maxUserTags} selectedCount={tags.length} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            {tags.length > 0 && <TagsContainer tags={tags} deleteTag={(i) => setTags(tags.filter((_, index) => index !== i))}/>}

            <div className="post-input-container">
                <div>
                    <label htmlFor={SAVE_SEARCH_ID}>
                        {replacingIndex !== null
                            ? `Pick the ID/EGO that replaces image ${replacingIndex + 1}:`
                            : `Enter ID/EGO you want to add to the post (Required) ${chosenSaves.length}/${maxImages}:`}
                    </label>
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
                    {chosenSaves.map((save, i) => <div key={chosenSaveKey(save)} className={`choosen-save-img-container ${replacingIndex === i ? "replacing" : ""}`}>
                        <IconButton className="remove-btn" label={`Remove image ${i + 1}`} disabled={!canRemove} onClick={() => removeSave(i)}>
                            <CloseIcon/>
                        </IconButton>
                        <img src={save.previewUrl} className="choosen-save-img" alt={`Chosen ${save.kind} ${i + 1}`} />
                        {isEditing && <ChosenSaveActions save={save} index={i} isReplacing={replacingIndex === i}
                            onChange={change => setChosenSaves(saves => change(saves, i))}
                            onReplace={() => setReplacingIndex(index => (index === i ? null : i))}/>}
                    </div>)}
                </div>
            </div>
            <div className="post-input-container">
                <p>Description:</p>
                <RichTextEditor className="post-description-input" id="description" label="Description" value={description} onChange={setDescription} toolbar/>
            </div>
            {isEditing
                ? <BusyButton busy={isUpdating} busyText="Saving..." onClick={handleSubmit}>Save changes</BusyButton>
                : <BusyButton busy={isPosting} busyText="Posting..." onClick={handleSubmit}>Post</BusyButton>}
        </div> :
            <div className="page-content">
                Please login to post
                <LoginPromptButton/>
            </div>}
    </div>
}
