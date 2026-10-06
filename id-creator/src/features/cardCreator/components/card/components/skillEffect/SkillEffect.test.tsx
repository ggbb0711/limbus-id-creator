import { render } from '@testing-library/react'
import SkillEffect from './SkillEffect'

describe('SkillEffect', () => {
    it('renders effect markup without scripts or handlers', () => {
        const { container } = render(<SkillEffect effect={'<p>Deal <b>10</b><script>alert(1)</script><img src=x onerror="alert(1)"></p>'}/>)
        expect(container.querySelector('script')).toBeNull()
        expect(container.querySelector('[onerror]')).toBeNull()
        expect(container.querySelector('b')?.textContent).toBe('10')
    })
})
