import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { reportError } from 'utils/reportError'
import { siteUrl } from 'config/siteMetadata'
import ShareMenu from './ShareMenu'

jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

const postUrl = `${siteUrl}/post/p1`

function setup({ share, writeText }: { share?: jest.Mock, writeText?: jest.Mock } = {}) {
    Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: share })
    Object.defineProperty(navigator, 'clipboard', { configurable: true, writable: true, value: writeText ? { writeText } : undefined })
    const store = makeStore()
    render(<Provider store={store}><ShareMenu postId="p1" title="My Faust" triggerClassName="post-display-card-tag" iconSize={12}/><p>outside</p></Provider>)
    const trigger = screen.getByRole('button', { name: 'Share this post' })
    return { store, trigger }
}

const open = (trigger: HTMLElement) => fireEvent.click(trigger)

describe('ShareMenu', () => {
    let windowOpen: jest.SpyInstance

    beforeEach(() => {
        windowOpen = jest.spyOn(window, 'open').mockReturnValue(null)
        jest.mocked(reportError).mockClear()
    })

    afterEach(() => {
        windowOpen.mockRestore()
        delete (navigator as { share?: unknown }).share
    })

    it('renders a small closed trigger styled like the stat chips', () => {
        const { trigger } = setup()
        expect(trigger).toHaveClass('post-display-card-tag')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('opens a menu with Reddit, Facebook, X and Copy link, focusing the first item', () => {
        const { trigger } = setup()
        open(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        const items = screen.getAllByRole('menuitem')
        expect(items.map(item => item.textContent)).toEqual(['Reddit', 'Facebook', 'X', 'Copy link'])
        expect(items[0]).toHaveFocus()
        expect(screen.getByRole('menu', { name: 'Share options' }).parentElement).toBe(document.body)
    })

    it('shares to a network in a popup and closes the menu', () => {
        const { trigger } = setup()
        open(trigger)
        fireEvent.click(screen.getByRole('menuitem', { name: 'Facebook' }))
        expect(windowOpen).toHaveBeenCalledTimes(1)
        const link = new URL(windowOpen.mock.calls[0][0] as string)
        expect(link.hostname).toBe('www.facebook.com')
        expect(link.searchParams.get('u')).toBe(postUrl)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
    })

    it('includes the title when sharing to X and Reddit', () => {
        const { trigger } = setup()
        open(trigger)
        fireEvent.click(screen.getByRole('menuitem', { name: 'X' }))
        const xLink = new URL(windowOpen.mock.calls[0][0] as string)
        expect(xLink.searchParams.get('url')).toBe(postUrl)
        expect(xLink.searchParams.get('text')).toBe('My Faust')
        open(trigger)
        fireEvent.click(screen.getByRole('menuitem', { name: 'Reddit' }))
        const redditLink = new URL(windowOpen.mock.calls[1][0] as string)
        expect(redditLink.hostname).toBe('www.reddit.com')
        expect(redditLink.searchParams.get('title')).toBe('My Faust')
    })

    it('copies the link and confirms', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined)
        const { trigger, store } = setup({ writeText })
        open(trigger)
        await act(async () => { fireEvent.click(screen.getByRole('menuitem', { name: 'Copy link' })) })
        expect(writeText).toHaveBeenCalledWith(postUrl)
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Success', msg: 'Link copied' })
    })

    it('alerts when the clipboard is unavailable', async () => {
        const { trigger, store } = setup()
        open(trigger)
        await act(async () => { fireEvent.click(screen.getByRole('menuitem', { name: 'Copy link' })) })
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Failure', msg: "Couldn't copy the link" })
        expect(reportError).toHaveBeenCalled()
    })

    it('closes with Escape and returns focus, and closes on an outside click', () => {
        const { trigger } = setup()
        open(trigger)
        fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
        open(trigger)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('moves focus with the arrow keys, wrapping around, and Home/End', () => {
        const { trigger } = setup()
        open(trigger)
        const menu = screen.getByRole('menu')
        const items = screen.getAllByRole('menuitem')
        fireEvent.keyDown(menu, { key: 'ArrowUp' })
        expect(items[3]).toHaveFocus()
        fireEvent.keyDown(menu, { key: 'ArrowDown' })
        expect(items[0]).toHaveFocus()
        fireEvent.keyDown(menu, { key: 'End' })
        expect(items[3]).toHaveFocus()
        fireEvent.keyDown(menu, { key: 'Home' })
        expect(items[0]).toHaveFocus()
    })

    it('offers the native share sheet when available and stays quiet on cancel', async () => {
        const share = jest.fn().mockRejectedValue(Object.assign(new Error('cancelled'), { name: 'AbortError' }))
        const { trigger, store } = setup({ share })
        open(trigger)
        await act(async () => { fireEvent.click(screen.getByRole('menuitem', { name: 'More…' })) })
        expect(share).toHaveBeenCalledWith({ title: 'My Faust', url: postUrl })
        expect(store.getState().alert.value).toEqual([])
    })

    it('reports a native share failure', async () => {
        const { trigger, store } = setup({ share: jest.fn().mockRejectedValue(new Error('NotAllowed')) })
        open(trigger)
        await act(async () => { fireEvent.click(screen.getByRole('menuitem', { name: 'More…' })) })
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Failure', msg: "Couldn't open the share menu" })
    })

    it('hides the native option when the browser cannot share', () => {
        const { trigger } = setup()
        open(trigger)
        expect(screen.queryByRole('menuitem', { name: 'More…' })).not.toBeInTheDocument()
    })
})
