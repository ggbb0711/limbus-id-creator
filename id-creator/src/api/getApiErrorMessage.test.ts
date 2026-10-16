import { ERROR_MESSAGES } from './errorCodes'
import getApiErrorMessage, { NETWORK_ERROR_MESSAGE, TOO_LARGE_MESSAGE } from './getApiErrorMessage'

describe('getApiErrorMessage', () => {
    it('prefers the server message', () => {
        expect(getApiErrorMessage({ status: 400, data: { message: 'Bad title' } })).toBe('Bad title')
    })

    it('uses the frontend text for a known error code', () => {
        expect(getApiErrorMessage({ status: 403, data: { message: 'You do not own this resource.', errorCode: 'RESOURCE_NOT_OWNED' } }))
            .toBe(ERROR_MESSAGES.RESOURCE_NOT_OWNED)
    })

    it('keeps the server message for validation errors and unknown codes', () => {
        expect(getApiErrorMessage({ status: 400, data: { message: 'Title is required', errorCode: 'VALIDATION_FAILED' } })).toBe('Title is required')
        expect(getApiErrorMessage({ status: 400, data: { message: 'Something new', errorCode: 'NEW_CODE' } })).toBe('Something new')
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
