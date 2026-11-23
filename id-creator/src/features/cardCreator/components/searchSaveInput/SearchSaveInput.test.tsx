import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SearchSaveInput from './SearchSaveInput'

jest.mock('features/cardCreator/api/SaveInfoApi', () => ({
    useGetSaveListQuery: () => ({
        data: { list: [{ id: 's1', name: 'Blade Lineage Faust', saveTime: '2024-01-01T00:00:00', previewImg: '/p.webp' }], total: 1 },
    }),
}))

describe('SearchSaveInput', () => {
    it('lists saves from the paged response and picks one', () => {
        const chooseSave = jest.fn()
        render(<SearchSaveInput userId="me" saveMode="ID" chooseSave={chooseSave}/>)

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Blade' } })
        fireEvent.click(screen.getByText('Blade Lineage Faust'))

        expect(chooseSave).toHaveBeenCalledWith({ id: 's1', previewUrl: '/p.webp' })
    })
})
