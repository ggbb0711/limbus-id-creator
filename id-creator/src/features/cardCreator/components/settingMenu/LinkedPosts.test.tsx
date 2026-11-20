import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import LinkedPosts, { linkedPostsTitle } from './LinkedPosts'

const posts = Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, title: `Post ${i}` }))

describe('LinkedPosts', () => {
    it('renders nothing without posts', () => {
        const { container } = render(<LinkedPosts posts={[]} saveName="My save"/>)
        expect(container).toBeEmptyDOMElement()
    })

    it('starts collapsed with the post count as the header', () => {
        render(<LinkedPosts posts={posts} saveName="My save"/>)
        const header = screen.getByRole('button', { name: 'Posted in 6 posts' })
        expect(header).toHaveAttribute('aria-expanded', 'false')
        expect(document.getElementById(header.getAttribute('aria-controls')!)).toHaveAttribute('inert')
    })

    it('expands to a labelled, focusable scroll list linking every post', () => {
        render(<LinkedPosts posts={posts} saveName="My save"/>)
        const header = screen.getByRole('button', { name: 'Posted in 6 posts' })

        fireEvent.click(header)

        expect(header).toHaveAttribute('aria-expanded', 'true')
        const list = screen.getByRole('list', { name: 'Posts using My save' })
        expect(list).toHaveClass('save-cloud-posted-in-list')
        expect(list).toHaveAttribute('tabindex', '0')
        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(6)
        expect(links[5]).toHaveAttribute('href', '/post/p5')
    })

    it('encodes post ids in the link', () => {
        render(<LinkedPosts posts={[{ id: 'a/b', title: 'Odd id' }]} saveName="My save"/>)
        expect(screen.getByRole('link', { name: 'Odd id' })).toHaveAttribute('href', '/post/a%2Fb')
    })

    it('uses the singular for one post', () => {
        expect(linkedPostsTitle(1)).toBe('Posted in 1 post')
        expect(linkedPostsTitle(3)).toBe('Posted in 3 posts')
    })
})
