import 'server-only'
import IResponse from 'types/IResponse'
import { serverConfig, serverEnv } from 'config/env.server'

export class ApiError extends Error {
    override name = 'ApiError'

    constructor(public status: number, message: string) {
        super(message)
    }
}

interface ApiGetOptions {
    revalidate?: number | false
    timeoutMs?: number
}

export async function apiGet<T>(path: string, { revalidate = serverConfig.apiRevalidateSeconds, timeoutMs = serverConfig.apiTimeoutMs }: ApiGetOptions = {}): Promise<T | null> {
    const res = await fetch(`${serverEnv.apiUrl}/API${path}`, {
        next: { revalidate },
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
    })
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`)
    const body = (await res.json()) as IResponse<T>
    if (!body.success) throw new ApiError(res.status, body.message || `GET ${path} returned success:false`)
    return body.data
}
