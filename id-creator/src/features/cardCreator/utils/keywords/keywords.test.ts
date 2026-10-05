import { buildCustomEffectKeywords, buildLocalKeywords, filterKeywordSuggestions, replaceKeywordsAsNodes, toKeywordKey } from './keywords'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'

const keywords = { burn: '<span>Burn</span>', 'r&d': '<span>R&amp;D</span>' }

describe('replaceKeywordsAsNodes', () => {
    it('turns a bracketed keyword into a status node', () => {
        expect(replaceKeywordsAsNodes('<p>Inflict [Burn]</p>', keywords))
            .toBe('<p>Inflict <span data-status-effect="<span>Burn</span>"><span>Burn</span></span></p>')
    })

    it('leaves unknown keywords and existing nodes alone', () => {
        const existing = '<span data-status-effect="x"><span>Burn</span></span>'
        expect(replaceKeywordsAsNodes('<p>[Unknown]</p>', keywords)).toBe('<p>[Unknown]</p>')
        expect(replaceKeywordsAsNodes(existing, keywords)).toBe(existing)
    })

    it('matches keys written with an escaped ampersand', () => {
        expect(replaceKeywordsAsNodes('[R&amp;D]', keywords)).toContain('data-status-effect=')
    })

    it('escapes the stored html inside the attribute so it decodes back unchanged', () => {
        const html = replaceKeywordsAsNodes('[R&amp;D]', keywords)
        const span = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-status-effect]')
        expect(span?.getAttribute('data-status-effect')).toBe('<span>R&amp;D</span>')
    })
})

describe('filterKeywordSuggestions', () => {
    const many = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`key${i}`, `<b>${i}</b>`]))

    it('matches by prefix, ignoring case', () => {
        expect(filterKeywordSuggestions({ Burn: 'b', bleed: 'x', poise: 'p' }, 'B').map(s => s.keyword)).toEqual(['Burn', 'bleed'])
    })

    it('respects the limit', () => {
        expect(filterKeywordSuggestions(many, '')).toHaveLength(10)
        expect(filterKeywordSuggestions(many, 'key', 3)).toHaveLength(3)
    })
})

describe('buildCustomEffectKeywords', () => {
    it('builds a keyword per named custom effect', () => {
        const result = buildCustomEffectKeywords([createCustomEffect({ name: 'Dark Flame', effectColor: '#ff0000' }), createOffenseSkill(), createCustomEffect()])
        expect(Object.keys(result)).toEqual(['dark_flame'])
        expect(result.dark_flame).toContain('color:#ff0000;')
        expect(result.dark_flame).toContain('Dark Flame')
    })

    it('adds coin variants only for coin effects', () => {
        const result = buildCustomEffectKeywords([createCustomEffect({ name: 'Burn', isCoinType: true })])
        expect(Object.keys(result)).toHaveLength(10)
        expect(result.coin_3_burn).toContain("data-custom-coin-effect='coin-effect-3-custom-burn'")
    })

    it('escapes names and drops unsafe colours and image urls', () => {
        const result = buildCustomEffectKeywords([createCustomEffect({
            name: '<img src=x onerror=alert(1)>',
            effectColor: 'red;background:url(x)',
            customImg: 'javascript:alert(1)',
        })])
        const html = Object.values(result)[0]
        expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
        expect(html).not.toContain('background')
        expect(html).not.toContain('javascript:')
    })

    it('keeps safe custom images', () => {
        const html = buildCustomEffectKeywords([createCustomEffect({ name: 'Icon', customImg: 'data:image/png;base64,AAA' })]).icon
        expect(html).toContain("src='data:image/png;base64,AAA'")
    })
})

describe('buildLocalKeywords', () => {
    it('keys keywords by their normalised name and escapes them', () => {
        const result = buildLocalKeywords([{ customKeywordID: '1', keyword: 'Big <Hit>', color: '#00ff00' }])
        expect(result).toEqual({ 'big_<hit>': "<span class='center-element' contenteditable='false' style='color:#00ff00;'>Big &lt;Hit&gt;</span>" })
    })

    it('normalises keys the same way as custom effects', () => {
        expect(toKeywordKey('Dark  Flame')).toBe('dark__flame')
    })
})
