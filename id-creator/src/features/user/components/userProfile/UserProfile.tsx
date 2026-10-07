'use client'
import { appConfig } from "config/env.client";
import { filesize } from "filesize";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { ReactElement } from "react";
import EditIcon from "assets/icons/EditIcon";
import CheckIcon from "assets/icons/CheckIcon";
import CloseIcon from "assets/icons/CloseIcon";
import { IUserProfile } from "features/user/types/IUserProfile";
import { validateUsername } from "features/user/utils/validateUsername";
import "./UserProfile.css";
import { useAddAlert } from "hooks/useAddAlert";
import { useUpdateUserMutation } from "features/user/api/UserApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import BusyButton from "components/ui/busyButton/BusyButton";

const MAX_USERNAME_LENGTH = appConfig.limits.user.maxUsernameLength
const MAX_ICON_BYTES = appConfig.limits.upload.userIcon

function UserNameEditor({ userProfile, onDone }: { userProfile: Omit<IUserProfile, "userEmail">, onDone: () => void }): ReactElement {
    const [name, setName] = useState(userProfile.userName)
    const [error, setError] = useState<string | null>(null)
    const addAlert = useAddAlert()
    const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation()

    async function save() {
        const invalid = validateUsername(name, MAX_USERNAME_LENGTH)
        if (invalid) return setError(invalid)
        try {
            await updateUser({ userId: userProfile.id, name: name.trim() }).unwrap()
            addAlert("Success", "Name changed")
            onDone()
        } catch (updateError) {
            addAlert("Failure", getApiErrorMessage(updateError, "Can't change name"))
        }
    }

    return <>
        <div className="center-element warning-message">
            <BusyButton busy={isSaving} busyText={<><p>Saving...</p><CheckIcon/></>} className="main-button center-element user-name-edit" onClick={save}>
                <p>Confirm</p>
                <CheckIcon/>
            </BusyButton>
            <button type="button" className="main-button center-element user-name-edit" onClick={onDone} disabled={isSaving}>
                <p>Cancel</p>
                <CloseIcon/>
            </button>
            {error && <p role="alert">({error})</p>}
        </div>
        <input className="input user-name" type="text" name="name" id="name" aria-label="Username" aria-invalid={!!error}
            maxLength={MAX_USERNAME_LENGTH} value={name} onChange={(e) => {
                setName(e.target.value)
                setError(null)
            }}/>
    </>
}

export function UserProfile({ userProfile, owned }: { userProfile: Omit<IUserProfile,"userEmail">, owned: boolean }): ReactElement {
    const { userName, userIcon } = userProfile
    const [isEditingName, setIsEditingName] = useState(false)
    const addAlert = useAddAlert()
    const [updateUserIcon, { isLoading: isChangingIcon }] = useUpdateUserMutation()

    async function handleChangeProfileImg(e: ChangeEvent<HTMLInputElement>) {
        const file = e.currentTarget.files?.[0]
        e.currentTarget.value = ""
        if (!file) return
        if (file.size > MAX_ICON_BYTES) {
            addAlert("Failure", `Profile pictures must be ${filesize(MAX_ICON_BYTES)} or smaller`)
            return
        }
        try {
            await updateUserIcon({ userId: userProfile.id, name: userName, iconFile: file }).unwrap()
            addAlert("Success", "Profile changed")
        } catch (updateError) {
            addAlert("Failure", getApiErrorMessage(updateError, "Can't change profile"))
        }
    }

    return <div className="user-personal-container center-element">
        <div className="user-profile-img-container">
            <Image className="user-personal-icon" src={userIcon} alt={`${userName}'s avatar`} width={80} height={80} />
            {owned &&
                <label className={`main-button center-element input-profile-img-button ${isChangingIcon ? "active" : ""}`} aria-busy={isChangingIcon}>
                    <input className="visually-hidden" type="file" name="input-profile-img" accept="image/png, image/jpeg" id="input-profile-img"
                        disabled={isChangingIcon} onChange={handleChangeProfileImg}/>
                    {isChangingIcon ? <p>Saving...</p> : <><p>Edit profile picture</p><EditIcon/></>}
                </label>
            }
        </div>
        <div className="user-name-container">
            {owned && isEditingName ?
                <UserNameEditor key={userName} userProfile={userProfile} onDone={() => setIsEditingName(false)}/> :
                <>
                    {owned && <div className="center-element warning-message">
                        <button type="button" className="main-button center-element user-name-edit" onClick={() => setIsEditingName(true)}>
                            <p>Edit</p>
                            <EditIcon/>
                        </button>
                    </div>}
                    <p className="user-name">{userName}</p>
                </>}
        </div>
    </div>
}
