import 'server-only'
import { cache } from 'react'
import { apiGetOrUnavailable } from 'api/server/serverFetch'
import { IUserProfile } from 'features/user/types/IUserProfile'

export const getUser = cache((userId: string) =>
    apiGetOrUnavailable<IUserProfile>(`/User/${encodeURIComponent(userId)}`),
)
