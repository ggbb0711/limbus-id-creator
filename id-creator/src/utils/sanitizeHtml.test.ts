import { sanitizeCardHtml, sanitizePostHtml } from './sanitizeHtml'

const parse = (html: string) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return template.content
}

const PNG = 'data:image/png;base64,iVBORw0KGgo='

describe('sanitizePostHtml', () => {
    it.each([
        ['<p>Hi<script>alert(1)</script></p>', 'script'],
        ['<img src="x" onerror="alert(1)">', '[onerror]'],
        ['<p onclick="alert(1)">x</p>', '[onclick]'],
        ['<b onmouseover="alert(1)">x</b>', '[onmouseover]'],
        ['<iframe src="https://evil.test"></iframe>', 'iframe'],
        ['<svg onload="alert(1)"><circle/></svg>', 'svg'],
        ['<form action="/x"><input name="a"></form>', 'form, input'],
        ['<style>body{display:none}</style><p>x</p>', 'style'],
        ['<object data="x.swf"></object>', 'object'],
    ])('removes dangerous markup from %s', (html, selector) => {
        expect(parse(sanitizePostHtml(html)).querySelector(selector)).toBeNull()
    })

    it.each([
        'javascript:alert(1)',
        'JaVaScRiPt:alert(1)',
        ' javascript:alert(1)',
        'data:text/html;base64,PHNjcmlwdD4=',
        'vbscript:msgbox(1)',
    ])('drops unsafe link %s', (href) => {
        const link = parse(sanitizePostHtml(`<a href="${href}">x</a>`)).querySelector('a')
        expect(link?.getAttribute('href')).toBeFalsy()
    })

    it('drops non-image data URIs on images', () => {
        const img = parse(sanitizePostHtml('<a href="data:image/svg+xml;base64,PHN2Zz4=">x</a>')).querySelector('a')
        expect(img?.getAttribute('href')).toBeFalsy()
    })

    it('keeps normal rich text', () => {
        const html = '<p><strong>Bold</strong> <u>under</u> <i>it</i> <s>gone</s></p><ul><li>one</li></ul><ol><li>two</li></ol><blockquote>q</blockquote>'
        expect(sanitizePostHtml(html)).toBe(html)
    })

    it('keeps safe links and adds rel to new-tab links', () => {
        const fragment = parse(sanitizePostHtml('<a href="https://limbuscompany.com" target="_blank">site</a><a href="/forum" target="_top">forum</a>'))
        const [external, internal] = Array.from(fragment.querySelectorAll('a'))
        expect(external.getAttribute('href')).toBe('https://limbuscompany.com')
        expect(external.getAttribute('rel')).toBe('noopener noreferrer')
        expect(internal.getAttribute('href')).toBe('/forum')
        expect(internal.hasAttribute('target')).toBe(false)
    })

    it('keeps base64 and site images and inline colours', () => {
        const fragment = parse(sanitizePostHtml(`<img src="${PNG}" alt="card"><img src="/Images/Coin.webp"><span style="color: red">red</span>`))
        const images = fragment.querySelectorAll('img')
        expect(images[0].getAttribute('src')).toBe(PNG)
        expect(images[1].getAttribute('src')).toBe('/Images/Coin.webp')
        expect(fragment.querySelector('span')?.getAttribute('style')).toBe('color: red')
    })

    it('does not keep card-only attributes', () => {
        const span = parse(sanitizePostHtml('<span contenteditable="true" data-status-effect="x">t</span>')).querySelector('span')
        expect(span?.hasAttribute('contenteditable')).toBe(false)
        expect(span?.hasAttribute('data-status-effect')).toBe(false)
    })

    it.each([null, undefined, ''])('returns an empty string for %p', (value) => {
        expect(sanitizePostHtml(value)).toBe('')
    })
})

describe('sanitizeCardHtml', () => {
    it('keeps the attributes status-effect markup needs', () => {
        const html = '<span class="center-element" contenteditable="false" data-custom-coin-effect="coin-effect-1-custom-burn" style="color:red;"><img class="status-icon" src="/Images/status-effect/Burn.webp" alt="burn">Burn</span>'
        expect(sanitizeCardHtml(html)).toBe(html)
    })

    it('keeps data-status-effect but strips handlers inside it', () => {
        const fragment = parse(sanitizeCardHtml('<span data-status-effect="&lt;span&gt;Burn&lt;/span&gt;"><img src="x" onerror="alert(1)">Burn</span>'))
        const span = fragment.querySelector('span')
        expect(span?.getAttribute('data-status-effect')).toBe('<span>Burn</span>')
        expect(fragment.querySelector('[onerror]')).toBeNull()
        expect(span?.textContent).toBe('Burn')
    })

    it('keeps TipTap image sizes', () => {
        const img = parse(sanitizeCardHtml(`<img src="${PNG}" width="40" height="40">`)).querySelector('img')
        expect(img?.getAttribute('width')).toBe('40')
    })

    it('does not allow arbitrary data attributes', () => {
        expect(parse(sanitizeCardHtml('<span data-evil="1">x</span>')).querySelector('[data-evil]')).toBeNull()
    })
})
