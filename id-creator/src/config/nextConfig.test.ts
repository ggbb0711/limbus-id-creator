jest.mock('@sentry/nextjs/config', () => ({ withSentryConfig: (config: object) => config }))

import nextConfig from '../../next.config'

describe('next.config images', () => {
    it('serves every image directly from its source instead of the Netlify Image CDN', () => {
        expect(nextConfig.images?.unoptimized).toBe(true)
    })
})
