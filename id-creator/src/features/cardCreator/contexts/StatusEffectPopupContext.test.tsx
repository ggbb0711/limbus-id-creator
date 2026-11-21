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

describe('StatusEffectPopupProvider copy', () => {
    function selectText(text: Element) {
        const selection = window.getSelection()!
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNodeContents(text)
        selection.addRange(range)
    }

    function copy(prevented = false) {
        const setData = jest.fn()
        const event = new Event('copy', { bubbles: true, cancelable: true })
        Object.defineProperty(event, 'clipboardData', { value: { setData } })
        if (prevented) event.preventDefault()
        document.dispatchEvent(event)
        return { setData, event }
    }

    afterEach(() => window.getSelection()!.removeAllRanges())

    it('copies status effects as their names with the html', () => {
        const { text } = renderWith(`<p>Gain ${statusSpan(customEffectHtml(fanatic))} now</p>`)
        selectText(text)

        const { setData, event } = copy()

        expect(setData).toHaveBeenCalledWith('text/plain', 'Gain Fanatic now')
        expect(setData).toHaveBeenCalledWith('text/html', expect.stringContaining('data-status-effect'))
        expect(event.defaultPrevented).toBe(true)
    })

    it('leaves copying to the browser without a status effect', () => {
        const { text } = renderWith('<p>plain</p>')
        selectText(text)

        const { setData, event } = copy()

        expect(setData).not.toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(false)
    })

    it('leaves an empty selection alone', () => {
        renderWith(`<p>${statusSpan(customEffectHtml(fanatic))}</p>`)

        expect(copy().setData).not.toHaveBeenCalled()
    })

    it('skips copies another handler already took', () => {
        const { text } = renderWith(`<p>${statusSpan(customEffectHtml(fanatic))}</p>`)
        selectText(text)

        expect(copy(true).setData).not.toHaveBeenCalled()
    })

    it('does not open the popup while text is selected', () => {
        const { result, text } = renderWith(`<p>Gain ${statusSpan(customEffectHtml(fanatic))}</p>`)
        selectText(text)

        let opened = true
        act(() => { opened = result.current.openFromElement(text.querySelector('[data-status-effect] span')) })

        expect(opened).toBe(false)
        expect(result.current.isOpen).toBe(false)
    })
})
