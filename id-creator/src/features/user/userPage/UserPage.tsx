'use client'
import React, { useState } from "react";
import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { PaginatedPost, usePaginatedPosts } from "features/post";
import { UserProfile } from "features/user/components/userProfile/UserProfile";
import UserProfileLoading from "features/user/components/userProfileLoading/UserProfileLoading";
import "./User.css"
import useAlert from "hooks/useAlert";
import { useLogOutMutation } from "api/AuthApi";
import { useGetUserQuery } from "features/user/api/UserApi";
import { useAuth } from "hooks/useAuth";
import { IUserProfile } from "features/user/types/IUserProfile";
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

    const { postList, maxCount, pageSize, isLoading: isLoadingPosts } = usePaginatedPosts(currPage, { userId })

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
                        pageLimit={pageSize}
                        postList={postList}
                        fetchPost={setCurrPage}
                        isLoading={isLoadingPosts}/>
                </div>
            </>
        :<p>User not found</p>}
    </div>
}