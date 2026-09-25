import 'server-only'
import { cache } from 'react'
import { apiGet } from './serverFetch'
import { IUserProfile } from 'types/api/oAuth/IUserProfile'

export const getUser = cache((userId: string) =>
    apiGet<IUserProfile>(`/User/${encodeURIComponent(userId)}`),
)
