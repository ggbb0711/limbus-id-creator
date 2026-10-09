import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..', '..')
const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8')

interface Redirect { from: string, to: string, status: number, force: boolean }

const redirects: Redirect[] = toml.split('[[redirects]]').slice(1).map(block => {
    const field = (name: string) => block.match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)$`, 'm'))?.[1].trim().replace(/^"|"$/g, '')
    return { from: field('from') ?? '', to: field('to') ?? '', status: Number(field('status')), force: field('force') === 'true' }
})

const probePaths = [
    '/wp-admin/*', '/wp-content/*', '/wp-includes/*', '/wp-json/*', '/wp-login.php', '/xmlrpc.php',
    '/.env', '/.git/*', '/phpmyadmin/*', '/vendor/*', '/cgi-bin/*',
]
const realRoutePrefixes = ['/API', '/Images', '/creator', '/_next', '/post', '/user', '/forum', '/blog', '/icons']

describe('netlify.toml scanner probe rules', () => {
    const probeRules = redirects.filter(r => r.to === '/404.html')

    it('serves a static 404 page', () => {
        expect(fs.existsSync(path.join(root, 'public', '404.html'))).toBe(true)
    })

    it.each(probePaths)('answers %s with a forced static 404', from => {
        expect(probeRules).toContainEqual({ from, to: '/404.html', status: 404, force: true })
    })

    it('never shadows a real route', () => {
        probeRules.forEach(rule => realRoutePrefixes.forEach(prefix => expect(rule.from.startsWith(prefix)).toBe(false)))
    })

    it('keeps the API proxy and legacy image rewrites', () => {
        expect(redirects).toContainEqual(expect.objectContaining({ from: '/API/*', status: 200 }))
        expect(redirects).toContainEqual(expect.objectContaining({ from: '/creator/Images/*', to: '/Images/:splat', status: 200 }))
    })
})
