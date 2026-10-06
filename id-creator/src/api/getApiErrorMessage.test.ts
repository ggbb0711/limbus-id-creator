import getApiErrorMessage, { NETWORK_ERROR_MESSAGE, TOO_LARGE_MESSAGE } from './getApiErrorMessage'

describe('getApiErrorMessage', () => {
    it('prefers the server message', () => {
        expect(getApiErrorMessage({ status: 400, data: { message: 'Bad title' } })).toBe('Bad title')
    })

    it('explains network failures', () => {
        expect(getApiErrorMessage({ status: 'FETCH_ERROR', error: 'TypeError: Failed to fetch' })).toBe(NETWORK_ERROR_MESSAGE)
        expect(getApiErrorMessage({ status: 'TIMEOUT_ERROR' })).toBe(NETWORK_ERROR_MESSAGE)
    })

    it('explains a 413 without a body', () => {
        expect(getApiErrorMessage({ status: 413, data: '<html>' })).toBe(TOO_LARGE_MESSAGE)
    })

    it('falls back for anything else', () => {
        expect(getApiErrorMessage({ status: 500 })).toBe('Something went wrong with the server')
        expect(getApiErrorMessage(undefined, 'custom')).toBe('custom')
        expect(getApiErrorMessage('boom')).toBe('Something went wrong with the server')
    })
})
