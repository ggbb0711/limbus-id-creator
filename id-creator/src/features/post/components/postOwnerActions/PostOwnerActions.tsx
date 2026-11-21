'use client'
import React, { ReactElement, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditIcon from "assets/icons/EditIcon";
import DeleteIcon from "assets/icons/DeleteIcon";
import ConfirmDialog from "components/ui/confirmDialog/ConfirmDialog";
import { useAuth } from "hooks/useAuth";
import { useAddAlert } from "hooks/useAddAlert";
import { useDeletePostMutation } from "features/post/api/PostApi";
import { revalidatePost } from "features/post/api/server/revalidatePost";
import getApiErrorMessage from "api/getApiErrorMessage";
import "./PostOwnerActions.css";

interface PostOwnerActionsProps {
    postId: string
    userId: string
    title: string
    className: string
}

export default function PostOwnerActions({ postId, userId, title, className }: PostOwnerActionsProps): ReactElement | null {
    const { user } = useAuth()
    const router = useRouter()
    const addAlert = useAddAlert()
    const [isConfirming, setIsConfirming] = useState(false)
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

    if (user?.id !== userId) return null

    async function confirmDelete() {
        setIsConfirming(false)
        try {
            await deletePost(postId).unwrap()
            await revalidatePost(postId, userId)
            addAlert("Success", "Post deleted")
            router.push(`/user/${encodeURIComponent(userId)}`)
        } catch (error) {
            addAlert("Failure", getApiErrorMessage(error))
        }
    }

    return <>
        <Link href={`/post/${encodeURIComponent(postId)}/edit`} className={`${className} post-owner-action`}>
            <EditIcon/> Edit
        </Link>
        <button type="button" className={`${className} post-owner-action delete`} disabled={isDeleting} aria-busy={isDeleting}
            onClick={() => setIsConfirming(true)}>
            <DeleteIcon/> {isDeleting ? "Deleting..." : "Delete"}
        </button>
        {isConfirming && <ConfirmDialog
            message={`Delete the post "${title}"? It will be hidden from everyone and can't be restored.`}
            onConfirm={confirmDelete}
            onCancel={() => setIsConfirming(false)}
        />}
    </>
}
