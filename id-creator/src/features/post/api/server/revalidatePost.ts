'use server'
import { revalidatePath } from "next/cache"

export async function revalidatePost(postId: string, userId?: string): Promise<void> {
    revalidatePath(`/post/${encodeURIComponent(postId)}`)
    if (userId) revalidatePath(`/user/${encodeURIComponent(userId)}`)
    revalidatePath("/forum")
    revalidatePath("/")
}
