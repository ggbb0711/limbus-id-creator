'use client'
import React, { useCallback } from "react";
import { ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginatedPost, usePaginatedPosts } from "features/post";
import { UserProfile } from "features/user/components/userProfile/UserProfile";
import "./User.css"
import { useAddAlert } from "hooks/useAddAlert";
import { useLogOutMutation } from "api/AuthApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import { useGetUserQuery } from "features/user/api/UserApi";
import { useAuth } from "hooks/useAuth";
import { IUserProfile } from "features/user/types/IUserProfile";
import formatDisplayDate from "utils/formatDisplayDate";
import { parsePage, withPage } from "utils/parsePage";
import BusyButton from "components/ui/busyButton/BusyButton";

export default function UserPage({ initialUser }: { initialUser: Omit<IUserProfile,"userEmail"> }): ReactElement {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currPage = parsePage(searchParams.get("page"))
    const [logOut, { isLoading: isLoggingOut }] = useLogOutMutation()
    const userId = initialUser.id
    const { user: loginUser } = useAuth()
    const addAlert = useAddAlert()

    const { data: user = initialUser, isFetching: isRefreshingUser } = useGetUserQuery(userId)
    const owned = !!loginUser && loginUser.id === user.id

    const { postList, maxCount, pageSize, isLoading: isLoadingPosts, error: postsError, refetch: refetchPosts } = usePaginatedPosts(currPage, { userId })

    const changePage = useCallback((page: number) => {
        const query = withPage(window.location.search, page)
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [pathname, router])

    async function logout() {
        try {
            await logOut().unwrap()
            addAlert("Success", "Logout successful")
            router.push("/forum")
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error))
        }
    }

    return <div className="page-container">
        <div className="page-content">
            <div className="user-container" aria-busy={isRefreshingUser}>
                <p className="user-meta-txt">Created at: {formatDisplayDate(user.createdAt)}</p>
                <UserProfile userProfile={user} owned={owned}/>
                <div className="user-log-out-container">
                    {owned && <BusyButton busy={isLoggingOut} busyText="Logging out..." onClick={logout}>Logout</BusyButton>}
                </div>
            </div>
        </div>
        <div className="page-content">
            <PaginatedPost currPage={currPage}
                maxCount={maxCount}
                pageLimit={pageSize}
                postList={postList}
                fetchPost={changePage}
                isLoading={isLoadingPosts}
                error={postsError}
                onRetry={refetchPosts}/>
        </div>
    </div>
}
