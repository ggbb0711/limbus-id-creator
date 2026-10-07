import * as Sentry from '@sentry/nextjs'
import { reportError, toError } from './reportError'

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }))

describe('toError', () => {
    it('keeps Error instances', () => {
        const error = new TypeError('bad')
        expect(toError(error)).toBe(error)
    })

    it('wraps strings', () => {
        expect(toError('oops').message).toBe('oops')
    })

    it('serialises objects', () => {
        expect(toError({ code: 5 }).message).toBe('{"code":5}')
    })

    it('names RTK Query error objects by status', () => {
        expect(toError({ status: 500, data: {} }).message).toBe('API error 500')
        expect(toError({ status: 'FETCH_ERROR', error: 'TypeError: Failed to fetch' }).message).toBe('API error FETCH_ERROR: TypeError: Failed to fetch')
    })

    it('falls back to String for unserialisable values', () => {
        const circular: Record<string, unknown> = {}
        circular.self = circular
        expect(toError(circular).message).toBe('[object Object]')
    })
})

describe('reportError', () => {
    it('sends the error to Sentry with its context', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        reportError('boom', { context: 'test', extra: { id: 1 } })
        expect(Sentry.captureException).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }), {
            tags: { context: 'test' },
            extra: { id: 1 },
        })
    })
})
