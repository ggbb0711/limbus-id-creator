import React, { useState } from "react";
import { ReactElement } from "react";
import EditIcon from "Assets/Icons/EditIcon";
import CheckIcon from "Assets/Icons/CheckIcon";
import { IUserProfile } from "Types/API/OAuth/IUserProfile";
import "./UserProfile.css";
import useAlert from "Hooks/useAlert";
import { useUpdateUserMutation } from "Api/UserApi";

export function UserProfile({userProfile,userId}:{userProfile:IUserProfile,userId:string}):ReactElement{
    const {userName,userIcon} = userProfile
    const [isChangeName,setIsChangeName] = useState(false)
    const [nameLenErr,setNameLenErr] = useState(false)
    const [name,setName] = useState(userName)
    const {addAlert} = useAlert()
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
        try {
            await updateUserIcon({ userId, name, iconFile: e.currentTarget.files[0] }).unwrap()
            addAlert("Success","Profile changed")
        } catch {
            addAlert("Failure","Can't change profile")
        }
    }

    const printProfileEditButton = ()=>{
        if (!userProfile.owned) return <></>

        return <div className="center-element warning-message">
            {isChangeName?
                <button className={`main-button ${isChangingName?"active":""} center-element user-name-edit`} onClick={()=>{
                    if(name.length<=65&&name.length>0){
                        handleChangeName()
                    }
                    else{
                        setUserErr("(Username must have at least one character and less than or equal to 64 characters)")
                        setNameLenErr(true)
                    }
                }}>
                    <p>{isChangingName?"Editting":"Confirm"}</p>
                    <CheckIcon/>
                </button>:
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
            <img className="user-personal-icon" src={userIcon} alt="user-icon" />
            {userProfile.owned &&
                <button className={`main-button ${isChangingProfile && "active"} center-element input-profile-img-button`}>
                    {isChangingProfile?
                        <p>Editing...</p>:
                        <>
                            <input className="input-profile-img" type="file" name="input-profile-img"  accept="image/png, image/jpeg" id="input-profile-img" onInput={handleChangeProfileImg}/>
                            <p>Edit Profile</p>
                            <EditIcon/>
                        </>
                    }
                </button>
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