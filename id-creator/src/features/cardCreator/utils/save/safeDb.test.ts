import { reportError } from 'utils/reportError'
import { safeDb } from './safeDb'

jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

describe('safeDb', () => {
    beforeEach(() => jest.mocked(reportError).mockClear())

    it('wraps a successful operation', async () => {
        await expect(safeDb(async () => 42, 'ctx')).resolves.toEqual({ ok: true, data: 42 })
        expect(reportError).not.toHaveBeenCalled()
    })

    it('reports and returns a failure instead of throwing', async () => {
        const error = new Error('blocked')
        await expect(safeDb(() => Promise.reject(error), 'ctx')).resolves.toEqual({ ok: false, error })
        expect(reportError).toHaveBeenCalledWith(error, { context: 'ctx' })
    })

    it('catches synchronous throws', async () => {
        const result = await safeDb(() => { throw new Error('sync') }, 'ctx')
        expect(result.ok).toBe(false)
    })
})
