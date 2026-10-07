import React from 'react'
import { render, screen } from '@testing-library/react'
import { appConfig } from 'config/env.client'
import { buildPostsQuery } from 'features/post/api/buildPostsQuery'
import { getPosts } from 'features/post/api/server/posts'
import type { GetPostsParams } from 'features/post/types/PostRequests'

jest.mock('server-only', () => ({}))
jest.mock('features/post/api/server/posts', () => ({ getPosts: jest.fn() }))
jest.mock('features/forum/forumIntro/ForumIntro', () => function ForumIntro() { return <div>intro</div> })
const mockForumPage = jest.fn()
jest.mock('features/forum/forumPage/ForumPage', () => (props: object) => mockForumPage(props))
jest.mock('features/post/components/paginatedPost/PostDisplayCard', () => ({
    PostDisplayCard: ({ title }: { title: string }) => <p>{title}</p>,
    PostListSkeleton: () => <div>skeleton</div>,
}))

import Page, { revalidate } from './page'

const defaultParams: GetPostsParams = { title: '', tag: [], sortedBy: 'Latest', page: 0, limit: appConfig.paging.postsPerPage }
const data = { list: [{ id: 'p1', title: 'First post' }, { id: 'p2', title: 'Second post' }], total: 2 }
const posts = jest.mocked(getPosts)

describe('forum page', () => {
    beforeEach(() => {
        posts.mockReset()
        mockForumPage.mockReset()
    })

    it('is statically cached and revalidated', () => {
        expect(revalidate).toBe(60)
    })

    it('fetches only the default listing on the server', async () => {
        posts.mockResolvedValue({ ok: true, data } as never)
        mockForumPage.mockReturnValue(<div>forum</div>)
        render(await Page())
        expect(posts).toHaveBeenCalledTimes(1)
        expect(posts).toHaveBeenCalledWith(defaultParams)
    })

    it('passes the default listing to the client page keyed by the default query', async () => {
        posts.mockResolvedValue({ ok: true, data } as never)
        mockForumPage.mockReturnValue(<div>forum</div>)
        render(await Page())
        expect(mockForumPage).toHaveBeenCalledWith({ initialPosts: { query: buildPostsQuery(defaultParams), data } })
    })

    it('renders the default posts while the client page suspends', async () => {
        posts.mockResolvedValue({ ok: true, data } as never)
        mockForumPage.mockImplementation(() => { throw new Promise(() => {}) })
        render(await Page())
        expect(screen.getByText('First post')).toBeInTheDocument()
        expect(screen.getByText('Second post')).toBeInTheDocument()
    })

    it('falls back to the skeleton when the server fetch fails', async () => {
        posts.mockResolvedValue({ ok: false, error: new Error('down') } as never)
        mockForumPage.mockImplementation(() => { throw new Promise(() => {}) })
        render(await Page())
        expect(screen.getByText('skeleton')).toBeInTheDocument()
        expect(mockForumPage).toHaveBeenCalledWith({ initialPosts: undefined })
    })
})
