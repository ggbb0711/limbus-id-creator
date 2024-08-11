import React, { useCallback, useEffect, useState } from "react";
import { ReactElement } from "react";
import "../User.css"
import MainButton from "utils/MainButton/MainButton";
import Edit_icon from "Icons/Edit_icon";
import Check_icon from "Icons/Check_icon";
import { useParams } from "react-router-dom";
import { IUserProfile } from "Interfaces/API/OAuth/IUserProfile";
import IResponse from "Interfaces/IResponse";
import { useAlertContext } from "component/context/AlertContext";



export default function UserProfile({userProfile,setUserProfile}:{userProfile:IUserProfile,setUserProfile:React.Dispatch<React.SetStateAction<IUserProfile>>}):ReactElement{
    const {userName,userIcon} = userProfile
    const [isChangeName,setIsChangeName] = useState(false)
    const [isChangingName,setIsChangingName] = useState(false)
    const [isChangingProfile,setIsChangingProfile] = useState(false)
    const [nameLenErr,setNameLenErr] = useState(false)
    const [name,setName] = useState(userName)
    const {userId} = useParams()
    const {addAlert} = useAlertContext()
    // const [userProfileImg,setUserProfileImg] = useState("")
    const [userError,setUserErr] = useState("")
    // const {onChangeFileWithName} = useInput({userProfileImg},({userProfileImg}:{userProfileImg:string})=>setUserProfileImg(userProfileImg))


    const changeName = useCallback(async()=>{
        if(!name||isChangingName) return
        setIsChangingName(true)
        try {
            console.log(name)
            const req = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/User/change/name/${userId}`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(name)
            })
            const res:IResponse<string> = (await req.json())
            if(req.ok){
                setUserProfile({...userProfile,userName:res.response})
                addAlert("Success","Name changed")
                setIsChangeName(false)
            }
            else{
                addAlert("Failure",res.msg)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Can't change name")
        }
        setIsChangingName(false)
    },[name,setName,userId,setUserProfile,isChangingName,setIsChangeName,addAlert])

    const changeProfileImg=useCallback(async(e:React.ChangeEvent<HTMLInputElement>)=>{
        setIsChangingProfile(true)
        try {
            const form = new FormData()
            form.append('newProfile',e.currentTarget.files[0])
            console.log(e.currentTarget.files[0])
            const req = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/User/change/profile/${userId}`,{
                method: "POST",
                credentials: "include",
                body:form
            })
            
            const res:IResponse<string> = (await req.json())
            if(!req.ok){
                addAlert("Failure",res.msg)
            }
            else{
                setUserProfile({...userProfile,userIcon:res.response})
                addAlert("Success","Profile changed")
                setIsChangeName(false)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Can't change profile")
        }
        setIsChangingProfile(false)
    },[userId])

    return <div className="user-personal-container center-element">
        <div className="user-profile-img-container">
            <img className="user-personal-icon" src={userIcon} alt="user-icon" />
            {userProfile.owned?
                <>
                    {isChangingProfile?
                    <MainButton component={<>
                        <p>Editing...</p>
                    </>} btnClass="main-button active center-element input-profile-img-button"/>:
                    <MainButton component={<>
                        <input className="input-profile-img" type="file" name="input-profile-img"  accept="image/png, image/jpeg" id="input-profile-img" onInput={changeProfileImg}/>
                        <p>Edit Profile</p>
                        <Edit_icon/>
                    </>} btnClass="main-button center-element input-profile-img-button"/>}
                </>
            :<></>}
            
            
        </div>
        <div className="user-name-container">
            {userProfile.owned?
            <div className="center-element warning-message">
                {isChangeName?
                <MainButton component={<>
                    <p>{isChangingName?"Editting":"Confirm"}</p>
                    <Check_icon/>
                </>} btnClass={`main-button ${isChangingName?"active":""} center-element user-name-edit`} clickHandler={()=>{
                    if(name.length<=65&&name.length>0){
                        changeName()
                    }
                    else{
                        setUserErr("(Username must have at least one character and less than or equal to 64 characters)")
                        setNameLenErr(true)
                    }
                }}/>:
                <MainButton component={<>
                    <p>Edit</p>
                    <Edit_icon/>
                </>} btnClass={"main-button center-element user-name-edit"} clickHandler={()=>setIsChangeName(!isChangeName)}/>}
                <p>{nameLenErr?userError:""}</p>
            </div>
            :<></>}
            {isChangeName?<input className="input user-name" type="text" name="name" id="name" value={name} onChange={(e)=>{
                setName(e.target.value)
                setNameLenErr(false)
            }}/>
            :<p className="user-name">{userName}</p>}
        </div>
        
    </div>
}