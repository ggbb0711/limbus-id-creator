jest.mock('server-only', () => ({}))
jest.mock('config/env.server', () => ({
    serverEnv: { apiUrl: 'http://api.test' },
    serverConfig: { apiRevalidateSeconds: 60, apiTimeoutMs: 50 },
}))

import { ApiError, apiGet } from './serverFetch'

const respond = (status: number, body: unknown) => ({ status, ok: status >= 200 && status < 300, json: async () => body })

describe('apiGet', () => {
    const fetchMock = jest.fn()

    beforeAll(() => {
        Object.defineProperty(globalThis, 'fetch', { configurable: true, writable: true, value: fetchMock })
        if (typeof AbortSignal.timeout !== 'function') {
            Object.defineProperty(AbortSignal, 'timeout', {
                configurable: true,
                value: (ms: number) => {
                    const controller = new AbortController()
                    setTimeout(() => controller.abort(new DOMException('timed out', 'TimeoutError')), ms)
                    return controller.signal
                },
            })
        }
    })

    beforeEach(() => fetchMock.mockReset())

    it('returns the data of a successful response', async () => {
        fetchMock.mockResolvedValue(respond(200, { success: true, data: { id: 'p' }, message: '' }))
        await expect(apiGet('/Post/p')).resolves.toEqual({ id: 'p' })
        expect(fetchMock.mock.calls[0][0]).toBe('http://api.test/API/Post/p')
        expect(fetchMock.mock.calls[0][1]).toMatchObject({ next: { revalidate: 60 }, signal: expect.any(AbortSignal) })
    })

    it('returns null for 404 and 400 so pages can call notFound()', async () => {
        fetchMock.mockResolvedValueOnce(respond(404, { success: false, message: 'Post does not exist' }))
        await expect(apiGet('/Post/missing')).resolves.toBeNull()
        fetchMock.mockResolvedValueOnce(respond(400, {}))
        await expect(apiGet('/Post/bad id')).resolves.toBeNull()
    })

    it('throws ApiError on a server error', async () => {
        fetchMock.mockResolvedValue(respond(500, {}))
        await expect(apiGet('/Post')).rejects.toMatchObject({ name: 'ApiError', status: 500 })
    })

    it('throws ApiError with the server message on success:false', async () => {
        fetchMock.mockResolvedValue(respond(200, { success: false, message: 'Database unavailable', data: null }))
        const error: Error = await apiGet('/Post').catch((e: Error) => e) as Error
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe('Database unavailable')
    })

    it('rejects when the backend is too slow', async () => {
        fetchMock.mockImplementation((_url: string, init: { signal: AbortSignal }) => new Promise((_resolve, reject) => {
            init.signal.addEventListener('abort', () => reject(init.signal.reason))
        }))
        await expect(apiGet('/Post', { timeoutMs: 10 })).rejects.toBeDefined()
    })
})
