import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SkillEffect from './SkillEffect'
import { StatusEffectPopupProvider } from 'features/cardCreator/contexts/StatusEffectPopupContext'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { customEffectHtml } from 'features/cardCreator/utils/keywords/keywords'

const fanatic = createCustomEffect({ name: 'Fanatic', effect: '<p>Skill Final Power +X</p>' })
const effectHtml = `<p>Plain text <span data-status-effect="x">${customEffectHtml(fanatic)}</span></p>`

function renderInParent(onParentClick: jest.Mock) {
    return render(<StatusEffectPopupProvider skills={[fanatic]}>
        <div onClick={onParentClick}><SkillEffect effect={effectHtml}/></div>
    </StatusEffectPopupProvider>)
}

describe('SkillEffect', () => {
    it('renders effect markup without scripts or handlers', () => {
        const { container } = render(<SkillEffect effect={'<p>Deal <b>10</b><script>alert(1)</script><img src=x onerror="alert(1)"></p>'}/>)
        expect(container.querySelector('script')).toBeNull()
        expect(container.querySelector('[onerror]')).toBeNull()
        expect(container.querySelector('b')?.textContent).toBe('10')
    })

    it('opens the popup for a custom effect without bubbling to the parent', () => {
        const onParentClick = jest.fn()
        const { container } = renderInParent(onParentClick)

        fireEvent.click(container.querySelector('[data-status-effect] span')!)

        expect(screen.getByRole('dialog', { name: 'Fanatic' })).toHaveTextContent('Skill Final Power +X')
        expect(onParentClick).not.toHaveBeenCalled()
    })

    it('lets clicks on plain text bubble without opening the popup', () => {
        const onParentClick = jest.fn()
        renderInParent(onParentClick)

        fireEvent.click(screen.getByText(/Plain text/))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(onParentClick).toHaveBeenCalledTimes(1)
    })
})
