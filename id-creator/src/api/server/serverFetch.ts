import 'server-only'
import IResponse from 'types/IResponse'
import { serverEnv } from 'config/env.server'

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
    }
}

/**
 * GET from the backend in Server Components. Returns null when the resource doesn't exist
 * (404, or 400 for a malformed id) so callers can `notFound()`.
 */
export async function apiGet<T>(path: string, { revalidate = 60 }: { revalidate?: number | false } = {}): Promise<T | null> {
    const res = await fetch(`${serverEnv.apiUrl}/API${path}`, {
        next: { revalidate },
        headers: { Accept: 'application/json' },
    })
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`)
    const body = (await res.json()) as IResponse<T>
    return body.success ? body.data : null
}
