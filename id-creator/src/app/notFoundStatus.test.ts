import fs from 'fs'
import path from 'path'

const APP_DIR = __dirname

function pageFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) return pageFiles(full)
        return entry.name === 'page.tsx' ? [full] : []
    })
}

function loadingFilesAbove(pageFile: string): string[] {
    const found: string[] = []
    for (let dir = path.dirname(pageFile); dir.startsWith(APP_DIR); dir = path.dirname(dir)) {
        const loading = path.join(dir, 'loading.tsx')
        if (fs.existsSync(loading)) found.push(path.relative(APP_DIR, loading))
        if (dir === APP_DIR) break
    }
    return found
}

const pagesWithNotFound = pageFiles(APP_DIR)
    .filter(file => fs.readFileSync(file, 'utf8').includes('notFound()'))
    .map(file => [path.relative(APP_DIR, file), file])

describe('pages that call notFound()', () => {
    it('includes the post and user pages', () => {
        expect(pagesWithNotFound.map(([name]) => name)).toEqual(expect.arrayContaining([
            path.join('(site)', 'post', '[postId]', 'page.tsx'),
            path.join('(site)', 'user', '[userId]', 'page.tsx'),
        ]))
    })

    it.each(pagesWithNotFound)('%s has no loading.tsx above it, so a missing item returns HTTP 404', (_, file) => {
        expect(loadingFilesAbove(file)).toEqual([])
    })
})
