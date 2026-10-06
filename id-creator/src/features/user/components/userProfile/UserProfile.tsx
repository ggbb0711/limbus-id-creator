'use client'
import { appConfig } from "config/env.client";
import { filesize } from "filesize";
import React, { useState } from "react";
import Image from "next/image";
import { ReactElement } from "react";
import EditIcon from "assets/icons/EditIcon";
import CheckIcon from "assets/icons/CheckIcon";
import { IUserProfile } from "features/user/types/IUserProfile";
import "./UserProfile.css";
import { useAddAlert } from "hooks/useAddAlert";
import { useUpdateUserMutation } from "features/user/api/UserApi";
import BusyButton from "components/ui/busyButton/BusyButton";

const MAX_USERNAME_LENGTH = appConfig.limits.user.maxUsernameLength

export function UserProfile({userProfile,userId,owned}:{userProfile:IUserProfile,userId:string,owned:boolean}):ReactElement{
    const {userName,userIcon} = userProfile
    const [isChangeName,setIsChangeName] = useState(false)
    const [nameLenErr,setNameLenErr] = useState(false)
    const [name,setName] = useState(userName)
    const addAlert = useAddAlert()
    const [userError,setUserErr] = useState("")

    const [updateUser, {isLoading: isChangingName}] = useUpdateUserMutation()
    const [updateUserIcon, {isLoading: isChangingProfile}] = useUpdateUserMutation()

    async function handleChangeName(){
        if(!name||isChangingName) return
        try {
            await updateUser({ userId, name }).unwrap()
            addAlert("Success","Name changed")
            setIsChangeName(false)
        } catch {
            addAlert("Failure","Can't change name")
        }
    }

    async function handleChangeProfileImg(e:React.ChangeEvent<HTMLInputElement>){
        if (!e.currentTarget.files || !e.currentTarget.files[0]) {
            addAlert("Failure", "No file selected")
            return
        }
        if (e.currentTarget.files[0].size > appConfig.limits.upload.userIcon) {
            addAlert("Failure", `Profile pictures must be ${filesize(appConfig.limits.upload.userIcon)} or smaller`)
            return
        }
        try {
            await updateUserIcon({ userId, name, iconFile: e.currentTarget.files[0] }).unwrap()
            addAlert("Success","Profile changed")
        } catch {
            addAlert("Failure","Can't change profile")
        }
    }

    const printProfileEditButton = ()=>{
        if (!owned) return <></>

        return <div className="center-element warning-message">
            {isChangeName?
                <BusyButton busy={isChangingName} className="main-button center-element user-name-edit" onClick={()=>{
                    if(name.length<=MAX_USERNAME_LENGTH&&name.length>0){
                        handleChangeName()
                    }
                    else{
                        setUserErr(`(Username must have at least one character and less than or equal to ${MAX_USERNAME_LENGTH} characters)`)
                        setNameLenErr(true)
                    }
                }}>
                    <p>{isChangingName?"Editing":"Confirm"}</p>
                    <CheckIcon/>
                </BusyButton>:
                <button className={"main-button center-element user-name-edit"} onClick={()=>setIsChangeName(!isChangeName)}>
                    <p>Edit</p>
                    <EditIcon/>
                </button>
            }
            <p>{nameLenErr?userError:""}</p>
        </div>
    }

    return <div className="user-personal-container center-element">

        <div className="user-profile-img-container">
            <Image className="user-personal-icon" src={userIcon} alt="user-icon" width={80} height={80} />
            {owned &&
                <BusyButton busy={isChangingProfile} busyText={<p>Editing...</p>} className="main-button center-element input-profile-img-button">
                    <input className="input-profile-img" type="file" name="input-profile-img"  accept="image/png, image/jpeg" id="input-profile-img" onChange={handleChangeProfileImg}/>
                    <p>Edit Profile</p>
                    <EditIcon/>
                </BusyButton>
            }
        </div>
        <div className="user-name-container">
            {printProfileEditButton()}
            {isChangeName?<input className="input user-name" type="text" name="name" id="name" value={name} onChange={(e)=>{
                setName(e.target.value)
                setNameLenErr(false)
            }}/>
            :<p className="user-name">{userName}</p>}
        </div>

    </div>
}