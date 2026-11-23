import React, { ReactNode } from 'react'
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusEffectPopupProvider, useStatusEffectPopup } from 'features/cardCreator/contexts/StatusEffectPopupContext'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { fromCustomEffect } from 'features/cardCreator/types/StatusEffectInfo'

const fanatic = createCustomEffect({
    name: 'Fanatic',
    customImg: 'https://example.com/fanatic.webp',
    effectColor: '#ff0000',
    effect: '<p>Skill Final Power +X</p><script>alert(1)</script>',
})

const wrapper = ({ children }: { children: ReactNode }) => <StatusEffectPopupProvider skills={[fanatic]}>
    <button type="button">anchor</button>
    <p>outside</p>
    {children}
</StatusEffectPopupProvider>

function renderOpen() {
    const { result } = renderHook(() => useStatusEffectPopup(), { wrapper })
    act(() => result.current.open(fromCustomEffect(fanatic), screen.getByRole('button', { name: 'anchor' })))
}

describe('StatusEffectPopup', () => {
    it('renders nothing while closed', () => {
        render(<StatusEffectPopupProvider skills={[fanatic]}><p>content</p></StatusEffectPopupProvider>)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('shows the icon, name and sanitized description when open', () => {
        renderOpen()
        const dialog = screen.getByRole('dialog', { name: 'Fanatic' })

        expect(dialog).toHaveTextContent('Fanatic')
        expect(dialog).toHaveTextContent('Skill Final Power +X')
        expect(dialog.querySelector('img')).toHaveAttribute('src', 'https://example.com/fanatic.webp')
        expect(dialog.querySelector('.status-effect-popup-header')).toHaveStyle({ color: '#ff0000' })
        expect(dialog.querySelector('script')).toBeNull()
    })

    it('closes on Escape', async () => {
        const user = userEvent.setup()
        renderOpen()

        await user.keyboard('{Escape}')

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes on an outside click', async () => {
        const user = userEvent.setup()
        renderOpen()

        await user.click(screen.getByText('outside'))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
})
