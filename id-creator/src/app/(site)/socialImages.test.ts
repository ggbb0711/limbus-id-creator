jest.mock('server-only', () => ({}))
jest.mock('features/post/api/server/PostSocialImage', () => ({ renderPostSocialImage: jest.fn(), postSocialImageAlt: 'post' }))
jest.mock('features/user/api/server/UserSocialImage', () => ({ renderUserSocialImage: jest.fn(), userSocialImageAlt: 'user' }))

import * as postOg from './post/[postId]/opengraph-image'
import * as postTwitter from './post/[postId]/twitter-image'
import * as userOg from './user/[userId]/opengraph-image'
import * as userTwitter from './user/[userId]/twitter-image'

describe.each([
    ['post opengraph', postOg],
    ['post twitter', postTwitter],
    ['user opengraph', userOg],
    ['user twitter', userTwitter],
])('%s image', (_, route) => {
    it('is rendered on demand and cached', () => {
        expect(route.generateStaticParams()).toEqual([])
        expect(route.revalidate).toBe(3600)
    })
})
