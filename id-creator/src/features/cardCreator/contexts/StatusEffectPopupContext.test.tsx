import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { StatusEffectPopupProvider, useStatusEffectPopup } from './StatusEffectPopupContext'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { customCoinEffectHtml, customEffectHtml } from 'features/cardCreator/utils/keywords/keywords'

const fanatic = createCustomEffect({ name: 'Fanatic', effect: '<p>Skill Final Power +X</p>' })

const statusSpan = (inner: string) => `<span data-status-effect="x">${inner}</span>`

function renderWith(html: string) {
    const wrapper = ({ children }: { children: ReactNode }) => <StatusEffectPopupProvider skills={[fanatic]}>
        <div data-testid="text" dangerouslySetInnerHTML={{ __html: html }}/>
        {children}
    </StatusEffectPopupProvider>
    const { result } = renderHook(() => useStatusEffectPopup(), { wrapper })
    return { result, text: document.querySelector('[data-testid="text"]')! }
}

describe('StatusEffectPopupContext', () => {
    it('opens for a custom effect span and closes again', () => {
        const { result, text } = renderWith(`<p>Gain ${statusSpan(customEffectHtml(fanatic))}</p>`)

        let opened = false
        act(() => { opened = result.current.openFromElement(text.querySelector('[data-status-effect] span')) })

        expect(opened).toBe(true)
        expect(result.current.isOpen).toBe(true)
        expect(result.current.current?.name).toBe('Fanatic')
        expect(result.current.anchor).toBe(text.querySelector('[data-status-effect]'))

        act(() => result.current.close())

        expect(result.current.isOpen).toBe(false)
        expect(result.current.current).toBeNull()
    })

    it('matches the coin variant by its name', () => {
        const { result, text } = renderWith(statusSpan(customCoinEffectHtml(fanatic, 'fanatic', 3)))

        act(() => { result.current.openFromElement(text.querySelector('[data-custom-coin-effect]')) })

        expect(result.current.current?.key).toBe('fanatic')
    })

    it('ignores plain text and unknown status effects', () => {
        const { result, text } = renderWith(`<p id="plain">Plain</p>${statusSpan('<span>Bleed</span>')}`)

        let opened = true
        act(() => { opened = result.current.openFromElement(text.querySelector('#plain')) })
        expect(opened).toBe(false)

        act(() => { opened = result.current.openFromElement(text.querySelector('[data-status-effect]')) })
        expect(opened).toBe(false)
        expect(result.current.isOpen).toBe(false)
    })

    it('is a no-op outside a provider', () => {
        const { result } = renderHook(() => useStatusEffectPopup())

        expect(result.current.isOpen).toBe(false)
        expect(result.current.openFromElement(document.body)).toBe(false)
    })
})
