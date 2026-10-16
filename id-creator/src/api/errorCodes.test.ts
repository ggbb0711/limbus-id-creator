import fs from 'fs'
import path from 'path'
import { ERROR_MESSAGES, UNAVAILABLE_TITLES, isErrorCode } from './errorCodes'

const backendCatalog = path.resolve(__dirname, '../../../id-creator-server/Server/Shared/Exception/ApiErrors.cs')
const describeIfBackend = fs.existsSync(backendCatalog) ? describe : describe.skip

describeIfBackend('error codes match the backend catalog', () => {
    it('has exactly the codes defined in ApiErrors.cs', () => {
        const source = fs.readFileSync(backendCatalog, 'utf8')
        const backendCodes = [...source.matchAll(/new\("([A-Z_]+)"/g)].map(m => m[1]).sort()
        expect(backendCodes.length).toBeGreaterThan(0)
        expect(Object.keys(ERROR_MESSAGES).sort()).toEqual(backendCodes)
    })
})

describe('isErrorCode', () => {
    it('recognises catalog codes only', () => {
        expect(isErrorCode('POST_REMOVED')).toBe(true)
        expect(isErrorCode('toString')).toBe(false)
        expect(isErrorCode(undefined)).toBe(false)
    })

    it('has a message for every unavailable title', () => {
        Object.keys(UNAVAILABLE_TITLES).forEach(code => expect(ERROR_MESSAGES[code as keyof typeof UNAVAILABLE_TITLES]).toBeTruthy())
    })
})
