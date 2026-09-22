import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginatedPost from "Components/PaginatedPost/PaginatedPost";
import { UserProfile } from "Features/User/Components/UserProfile/UserProfile";
import UserProfileLoading from "Components/UserProfileLoading/UserProfileLoading";
import "../Shared/Styles/PageLayout.css"
import "./User.css"
import useAlert from "Hooks/useAlert";
import { useLogOutMutation } from "Api/AuthApi";
import { useGetPostsQuery } from "Api/PostAPI";
import getApiErrorMessage from "Utils/getApiErrorMessage";
import { useGetUserQuery } from "Api/UserApi";

export default function UserPage():ReactElement{
    const [currPage,setCurrPage] = useState(0)
    const [ logOut, {isLoading: isLoggingOut} ] = useLogOutMutation();
    const {userId} = useParams()
    const {addAlert} = useAlert()
    const navigate = useNavigate()

    const { data: user, isLoading: isFetchingUser } = useGetUserQuery(userId!)

    const { data: postsData, isLoading: isLoadingPosts, error: postsError } = useGetPostsQuery({
        page: currPage,
        limit: 10,
        userId,
    })

    const postList = postsData?.list.map((p) => ({
        ...p,
        cardImg: p.imagesAttach[0]
    })) ?? []
    const maxCount = postsData?.total ?? 0

    useEffect(() => {
        if (postsError) addAlert("Failure", getApiErrorMessage(postsError))
    }, [postsError])

    async function logout(){
        try {
            await logOut().unwrap()
            addAlert("Success","Logout successful")
            navigate("/Forum")
        } catch {
            addAlert("Failure","Something went wrong with the server")
        }
    }

    return <div className="page-container">
        {user?
            <>
                <div className="page-content">

                    <div className="user-container">
                        <p className="user-meta-txt">Created at: {new Date(user.createdAt).toLocaleDateString()}</p>
                        {isFetchingUser?<UserProfileLoading/>:<UserProfile userProfile={user} userId={userId!} />}
                        <div className="user-log-out-container">
                            {user.owned && <button className={isLoggingOut?"main-button active":"main-button"} onClick={logout}>{isLoggingOut?"Logging out...":"Logout"}</button>}
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