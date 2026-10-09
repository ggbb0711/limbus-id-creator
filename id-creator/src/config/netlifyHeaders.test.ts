import fs from 'fs'
import path from 'path'

const toml = fs.readFileSync(path.join(__dirname, '..', '..', 'netlify.toml'), 'utf8')

const headers = toml.split('[[headers]]').slice(1).map(block => ({
    for: block.match(/^\s*for\s*=\s*"([^"]+)"/m)?.[1],
    cacheControl: block.match(/^\s*Cache-Control\s*=\s*"([^"]+)"/m)?.[1],
}))

const STATIC_CACHE = 'public, max-age=604800, stale-while-revalidate=86400'

describe('netlify.toml static asset caching', () => {
    it.each(['/Images/*', '/creator/Images/*', '/icons/*'])('caches %s in the browser', route => {
        expect(headers).toContainEqual({ for: route, cacheControl: STATIC_CACHE })
    })

    it('never caches HTML routes', () => {
        headers.forEach(h => expect(['/*', '/', '/forum', '/post/*']).not.toContain(h.for))
    })
})
