import { StrictMode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomKeywordMenu from './CustomKeywordMenu'
import { CUSTOM_KEYWORDS_STORAGE_KEY } from 'features/cardCreator/utils/customKeywordStorage'

const stored = () => JSON.parse(localStorage.getItem(CUSTOM_KEYWORDS_STORAGE_KEY) ?? 'null')

describe('CustomKeywordMenu', () => {
    beforeEach(() => localStorage.clear())

    it('keeps saved keywords when the menu mounts in Strict Mode', () => {
        const saved = [{ customKeywordID: 'a', keyword: 'Burn', color: '#ff0000' }]
        localStorage.setItem(CUSTOM_KEYWORDS_STORAGE_KEY, JSON.stringify(saved))
        render(<StrictMode><CustomKeywordMenu/></StrictMode>)
        expect(screen.getByDisplayValue('Burn')).toBeInTheDocument()
        expect(stored()).toEqual(saved)
    })

    it('saves a newly added keyword', () => {
        render(<StrictMode><CustomKeywordMenu/></StrictMode>)
        fireEvent.change(screen.getByLabelText(/Add new custom keyword/), { target: { value: 'Sinking' } })
        fireEvent.click(screen.getByDisplayValue('Add'))
        expect(stored()).toEqual([expect.objectContaining({ keyword: 'Sinking' })])
    })

    it('saves deletions', () => {
        localStorage.setItem(CUSTOM_KEYWORDS_STORAGE_KEY, JSON.stringify([{ customKeywordID: 'a', keyword: 'Burn', color: '' }]))
        const { container } = render(<CustomKeywordMenu/>)
        fireEvent.click(container.querySelector('.custom-keyword-tab-delete-icon') as Element)
        expect(stored()).toEqual([])
    })
})
