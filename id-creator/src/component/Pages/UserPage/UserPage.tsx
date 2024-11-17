import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "../PageLayout.css"
import IdAndEgoDisplayList from "component/util/PostDisplayList/PostDisplayList";
import IdAndEgoLocalDisplayList from "./User/IdAndEgoLocalDisplayList/IdAndEgoLocalDisplayList";
import UserProfile from "./User/UserProfile";
import "./User.css"
import {  useNavigate, useParams } from "react-router-dom";
import UserProfileLoading from "./User/UserProfileLoading";
import { IUserProfile, UserProfileRes } from "Interfaces/API/OAuth/IUserProfile";
import MainButton from "utils/MainButton/MainButton";
import { useAlertContext } from "component/context/AlertContext";
import { useLoginUserContext } from "component/context/LoginUserContext";
import PaginatedPost from "../PaginatedPost/PaginatedPost";
import { IPostDisplayCard } from "Interfaces/IPostDisplayCard/IPostDisplayCard";



export default function UserPage():ReactElement{
    const [isLoadingPosts,setIsLoadingPosts] = useState(false)
    const [currPage,setCurrPage] = useState(0)
    const [maxCount,setMaxCount] = useState(0)
    const [postList,setPostList] = useState<IPostDisplayCard[]>([])
    const [isFetchingUser,setIsFetchingUser] = useState(true)
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const {logOut,loginUser} = useLoginUserContext()
    const [user,setUser] = useState<IUserProfile>(new UserProfileRes("","","","","",false))
    const {userId} = useParams()
    const {addAlert} = useAlertContext()
    const navigate = useNavigate()

    async function getPosts(page:number){
        setIsLoadingPosts(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Post?page=${page}&UserId=${userId}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok){
                addAlert("Failure",result.msg)
                setPostList([])
            }
            else{ 
                const newList = result.response.list.map((p)=>({
                    ...p,
                    cardImg:p.imagesAttach[0]
                }))
                setPostList(newList)
                setMaxCount(result.response.total)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
            setPostList([])
        }
        setIsLoadingPosts(false)
    }


    async function logout(){
        setIsLoggingOut(true)
        try {
            let res=await fetch(`${process.env.REACT_APP_SERVER_URL}/API/OAuth/oauth2/logout`,{
                method:"POST",
                credentials: "include",
            })
            let result = await res.json()
            if(399<res.status&&res.status<500){
                addAlert("Failure",result.msg)
            }
            else{
                addAlert("Success",result.msg)
                logOut()
                navigate("/Forum")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        finally{ 
            setIsLoggingOut(false)
        }
    }


    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_URL}/API/User/${userId}`,{
            credentials: "include",
        })
        .then(res=>res.json())
        .then((res) => {
            if(res.response)setUser(res.response)
            else{setUser(null)}
        })
        .catch((err) => {
            console.log(err)
            setUser(null)
        })
        .finally(()=>setIsFetchingUser(false))
    },[JSON.stringify(loginUser)])

    useEffect(()=>{
        getPosts(currPage)
    },[currPage])

    return <div className="page-container">
        {user?
            <>
                <div className="page-content">
                    
                    <div className="user-container">
                        <p className="user-meta-txt">Created at: {user.createdAt.split(" ")[0]}</p>
                        {isFetchingUser?<UserProfileLoading/>:<UserProfile userProfile={user} setUserProfile={setUser} />}
                        <div className="user-log-out-container">
                            {user.owned?<MainButton btnClass={isLoggingOut?"main-button active":"main-button"} component={isLoggingOut?"Logging out...":"Logout"} clickHandler={logout}/>:<></>}
                        </div>
                    </div>
                    
                </div>
                <div className="page-content">
                    <PaginatedPost currPage={currPage}
                                maxCount={maxCount}
                                pageLimit={10}
                                postList={postList}
                                fetchPost={setCurrPage}
                                isLoading={isLoadingPosts}/>
                </div>
            </>
        :<p>User not found</p>}
    </div>
}