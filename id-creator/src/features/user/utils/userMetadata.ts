import type { Metadata } from "next"
import { baseOpenGraph } from "config/siteMetadata"
import { IUserProfile } from "features/user/types/IUserProfile"

export const userPath = (userId: string) => `/user/${encodeURIComponent(userId)}`

export function userMetadata(user: Pick<IUserProfile, "id" | "userName">): Metadata {
    const path = userPath(user.id)
    const description = `Custom Limbus Company Identities and E.G.Os by ${user.userName}`
    return {
        title: user.userName,
        description,
        alternates: { canonical: path },
        openGraph: { ...baseOpenGraph, type: "profile", title: user.userName, description, url: path, username: user.userName },
        twitter: { card: "summary_large_image", title: user.userName, description },
    }
}
