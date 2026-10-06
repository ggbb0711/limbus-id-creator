import { parsePage, withPage } from './parsePage'

describe('parsePage', () => {
    it.each([[undefined, 0], ['4', 4], ['1.5', 0], ['-2', 0], ['x', 0]])('%p -> %d', (value, page) => {
        expect(parsePage(value)).toBe(page)
    })
})

describe('withPage', () => {
    it('sets the page and keeps other parameters', () => {
        expect(withPage('?q=a&page=1', 3)).toBe('q=a&page=3')
    })

    it('drops page 0', () => {
        expect(withPage('page=2&q=a', 0)).toBe('q=a')
    })
})
