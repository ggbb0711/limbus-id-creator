'use client'
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import PaginatedPost from "components/paginatedPost/PaginatedPost";
import { UserProfile } from "features/user/components/userProfile/UserProfile";
import UserProfileLoading from "components/userProfileLoading/UserProfileLoading";
import "./User.css"
import useAlert from "hooks/useAlert";
import { useLogOutMutation } from "api/AuthApi";
import { useGetPostsQuery } from "api/PostAPI";
import getApiErrorMessage from "utils/getApiErrorMessage";
import { useGetUserQuery } from "api/UserApi";
import { useAuth } from "hooks/useAuth";
import { IUserProfile } from "types/api/oAuth/IUserProfile";
import formatDisplayDate from "utils/formatDisplayDate";

export default function UserPage({initialUser}:{initialUser:IUserProfile}):ReactElement{
    const [currPage,setCurrPage] = useState(0)
    const [ logOut, {isLoading: isLoggingOut} ] = useLogOutMutation();
    const userId = initialUser.id
    const {user: loginUser} = useAuth()
    const {addAlert} = useAlert()
    const router = useRouter()

    const { data: user = initialUser, isLoading: isFetchingUser } = useGetUserQuery(userId)
    const owned = !!loginUser && loginUser.id === user.id

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
            router.push("/forum")
        } catch {
            addAlert("Failure","Something went wrong with the server")
        }
    }

    return <div className="page-container">
        {user?
            <>
                <div className="page-content">

                    <div className="user-container">
                        <p className="user-meta-txt">Created at: {formatDisplayDate(user.createdAt)}</p>
                        {isFetchingUser?<UserProfileLoading/>:<UserProfile userProfile={user} userId={userId} owned={owned} />}
                        <div className="user-log-out-container">
                            {owned && <button className={isLoggingOut?"main-button active":"main-button"} onClick={logout}>{isLoggingOut?"Logging out...":"Logout"}</button>}
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