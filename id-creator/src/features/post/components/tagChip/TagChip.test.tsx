import { fireEvent, render, screen } from '@testing-library/react'
import TagChip from './TagChip'

describe('TagChip', () => {
    it('renders the icon and name', () => {
        render(<TagChip tag={{ icon: '/Images/sinner-icon/Faust_Icon.webp', tagName: 'Faust' }} className="chip" iconClassName="chip-img" iconSize={12}/>)
        expect(screen.getByText('Faust')).toBeInTheDocument()
        expect(screen.getByAltText('Faust_icon')).toHaveClass('chip-img')
    })

    it('skips the icon when there is none and renders children', () => {
        const onClick = jest.fn()
        const { container } = render(<TagChip tag={{ icon: '', tagName: 'Other' }} className="chip" iconClassName="i" iconSize={12} onClick={onClick}><span>x</span></TagChip>)
        expect(container.querySelector('img')).not.toBeInTheDocument()
        expect(screen.getByText('x')).toBeInTheDocument()
        fireEvent.click(container.firstChild as Element)
        expect(onClick).toHaveBeenCalled()
    })

    it('survives an unknown tag', () => {
        const { container } = render(<TagChip tag={undefined} className="chip" iconClassName="i" iconSize={12}/>)
        expect(container.firstChild).toHaveClass('chip')
    })
})
