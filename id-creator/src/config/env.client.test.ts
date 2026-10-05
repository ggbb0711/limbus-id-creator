import fs from 'fs'
import path from 'path'

const configKeys = (file: string) =>
    [...fs.readFileSync(path.join(__dirname, file), 'utf8').matchAll(/process\.env\.([A-Z0-9_]+)/g)].map(match => match[1])

const exampleKeys = () =>
    fs.readFileSync(path.join(__dirname, '../../.env.example'), 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=')[0])

describe('appConfig', () => {
    const original = { ...process.env }

    beforeEach(() => {
        jest.resetModules()
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        for (const key of Object.keys(process.env)) {
            if (key.startsWith('NEXT_PUBLIC_') && key !== 'NEXT_PUBLIC_SERVER_URL') delete process.env[key]
        }
    })

    afterEach(() => {
        process.env = { ...original }
        jest.restoreAllMocks()
    })

    it('uses the documented defaults when nothing is set', async () => {
        const { appConfig } = await import('./env.client')
        expect(appConfig.limits.card.maxSkills).toBe(40)
        expect(appConfig.limits.post.maxForumFilterTags).toBe(21)
        expect(appConfig.limits.upload.skillImage).toBe(100_000)
        expect(appConfig.paging.commentsPerPage).toBe(10)
        expect(appConfig.timing.alertMs).toBe(4000)
        expect(appConfig.image.webpQuality).toBe(0.7)
    })

    it('reads overrides from the environment', async () => {
        process.env.NEXT_PUBLIC_MAX_SKILLS = '25'
        process.env.NEXT_PUBLIC_WEBP_QUALITY = '0.5'
        const { appConfig } = await import('./env.client')
        expect(appConfig.limits.card.maxSkills).toBe(25)
        expect(appConfig.image.webpQuality).toBe(0.5)
    })

    it('ignores invalid overrides', async () => {
        process.env.NEXT_PUBLIC_MAX_SKILLS = '0'
        process.env.NEXT_PUBLIC_POSTS_PER_PAGE = 'abc'
        const { appConfig } = await import('./env.client')
        expect(appConfig.limits.card.maxSkills).toBe(40)
        expect(appConfig.paging.postsPerPage).toBe(10)
    })

    it('keeps the deploy defaults unless a value is set, and allows turning them off', async () => {
        process.env.NEXT_PUBLIC_GA_ID = ''
        const { clientEnv } = await import('./env.client')
        expect(clientEnv.gaId).toBe('')
        expect(clientEnv.siteUrl).toBe('https://limbus-company-id-creator.com')
    })
})

describe('.env.example', () => {
    it('lists exactly the variables the config reads', () => {
        const read = new Set([...configKeys('env.client.ts'), ...configKeys('env.server.ts'), 'API_URL'])
        expect(new Set(exampleKeys())).toEqual(read)
    })
})
