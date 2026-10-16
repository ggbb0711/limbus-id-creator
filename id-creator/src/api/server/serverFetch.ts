import 'server-only'
import IResponse from 'types/IResponse'
import { serverConfig, serverEnv } from 'config/env.server'

export class ApiError extends Error {
    override name = 'ApiError'

    constructor(public status: number, message: string, public errorCode?: string) {
        super(message)
    }
}

export interface Unavailable {
    unavailable: true
    code: string
}

export const isUnavailable = (value: unknown): value is Unavailable =>
    typeof value === 'object' && value !== null && (value as Partial<Unavailable>).unavailable === true

interface ApiGetOptions {
    revalidate?: number | false
    timeoutMs?: number
}

async function request(path: string, { revalidate = serverConfig.apiRevalidateSeconds, timeoutMs = serverConfig.apiTimeoutMs }: ApiGetOptions) {
    return fetch(`${serverEnv.apiUrl}/API${path}`, {
        next: { revalidate },
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
    })
}

async function readBody<T>(res: Response, path: string): Promise<T | null> {
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`)
    const body = (await res.json()) as IResponse<T>
    if (!body.success) throw new ApiError(res.status, body.message || `GET ${path} returned success:false`, body.errorCode ?? undefined)
    return body.data
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T | null> {
    return readBody<T>(await request(path, options), path)
}

export async function apiGetOrUnavailable<T>(path: string, options: ApiGetOptions = {}): Promise<T | Unavailable | null> {
    const res = await request(path, options)
    if (res.status === 410) {
        const body = (await res.json().catch(() => null)) as Partial<IResponse<unknown>> | null
        return { unavailable: true, code: body?.errorCode ?? '' }
    }
    return readBody<T>(res, path)
}
