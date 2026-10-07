import { escapeHtml, isSafeCssColor, isSafeImageUrl } from './escapeHtml'

describe('escapeHtml', () => {
    it('escapes the characters that can break out of html or attributes', () => {
        expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe('&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;')
    })

    it('leaves plain text unchanged', () => {
        expect(escapeHtml('Dark Flame')).toBe('Dark Flame')
    })
})

describe('isSafeCssColor', () => {
    it.each(['#fff', '#ff0000', 'rgb(1, 2, 3)', 'rgba(1,2,3,0.5)', 'hsl(10, 50%, 50%)', 'var(--Wrath)', 'red'])('accepts %s', color => {
        expect(isSafeCssColor(color)).toBe(true)
    })

    it.each(['red;background:url(x)', 'url(x)', 'expression(alert(1))', '"red"'])('rejects %s', color => {
        expect(isSafeCssColor(color)).toBe(false)
    })
})

describe('isSafeImageUrl', () => {
    it.each(['data:image/png;base64,AAA', 'https://cdn.example/a.webp', '/Images/a.webp'])('accepts %s', url => {
        expect(isSafeImageUrl(url)).toBe(true)
    })

    it.each(['javascript:alert(1)', 'data:text/html;base64,AAA', 'x" onerror="y'])('rejects %s', url => {
        expect(isSafeImageUrl(url)).toBe(false)
    })
})
