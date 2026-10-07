import 'server-only'
import { cache } from 'react'
import { apiGet } from 'api/server/serverFetch'
import { IUserProfile } from 'features/user/types/IUserProfile'

export const getUser = cache((userId: string) =>
    apiGet<IUserProfile>(`/User/${encodeURIComponent(userId)}`),
)
