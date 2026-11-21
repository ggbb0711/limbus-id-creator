import { baseStatusEffect } from './BaseStatusEffect'
import { customCoinEffectHtml, customEffectHtml, replaceKeywordsAsNodes } from './keywords'
import { containsStatusEffect, htmlToKeywordText, keywordKeyOf, selectionClipboard, statusEffectName, statusEffectNameFromHtml, toPlainText } from './statusEffectClipboard'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'

const fragment = (html: string) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return template.content
}

const firstStatus = (html: string) => fragment(html).firstElementChild!

const asNodes = (text: string, keywords = baseStatusEffect) => replaceKeywordsAsNodes(text, keywords)

describe('toPlainText', () => {
    it('writes status effects as their name and drops their icon', () => {
        expect(toPlainText(fragment(asNodes('<p>Inflict 3 [burn] now</p>')), statusEffectName)).toBe('Inflict 3 Burn now')
    })

    it('puts paragraphs and line breaks on new lines', () => {
        expect(toPlainText(fragment('<p>One</p><p>Two<br>Three</p>'), statusEffectName)).toBe('One\nTwo\nThree')
    })

    it('counts a nested custom coin effect once', () => {
        const fanatic = createCustomEffect({ name: 'Fanatic' })
        expect(toPlainText(fragment(`<p>${customCoinEffectHtml(fanatic, 'fanatic', 1)} Gain</p>`), () => 'X')).toBe('X Gain')
    })
})

describe('statusEffectNameFromHtml', () => {
    it('returns the text of a status html', () => {
        expect(statusEffectNameFromHtml(baseStatusEffect.burn)).toBe('Burn')
        expect(statusEffectNameFromHtml(baseStatusEffect.coin_1)).toBe('')
    })
})

describe('containsStatusEffect', () => {
    it('finds status wrappers and bare non-editable spans', () => {
        expect(containsStatusEffect(fragment(asNodes('[burn]')))).toBe(true)
        expect(containsStatusEffect(fragment(baseStatusEffect.burn))).toBe(true)
        expect(containsStatusEffect(fragment('<p>plain</p>'))).toBe(false)
    })
})

describe('selectionClipboard', () => {
    const select = (html: string) => {
        const host = document.createElement('div')
        host.innerHTML = html
        document.body.appendChild(host)
        const selection = window.getSelection()!
        selection.removeAllRanges()
        const range = document.createRange()
        range.selectNodeContents(host)
        selection.addRange(range)
        return { selection, cleanup: () => host.remove() }
    }

    it('returns null for an empty selection', () => {
        window.getSelection()!.removeAllRanges()
        expect(selectionClipboard(window.getSelection())).toBeNull()
        expect(selectionClipboard(null)).toBeNull()
    })

    it('returns null when no status effect is selected', () => {
        const { selection, cleanup } = select('<p>plain text</p>')
        expect(selectionClipboard(selection)).toBeNull()
        cleanup()
    })

    it('returns the status names as text and keeps the html', () => {
        const { selection, cleanup } = select(asNodes('<p>Inflict 3 [burn]</p>'))
        const clipboard = selectionClipboard(selection)!
        expect(clipboard.text).toBe('Inflict 3 Burn')
        expect(clipboard.html).toContain('data-status-effect')
        cleanup()
    })
})

describe('keywordKeyOf', () => {
    const fanatic = createCustomEffect({ name: 'Fanatic Rage', effectColor: '#ff0000' })
    const matchList = { ...baseStatusEffect, fanatic_rage: customEffectHtml(fanatic) }

    it('matches the html of a base and a custom effect', () => {
        expect(keywordKeyOf(firstStatus(asNodes('[burn]')), matchList)).toBe('burn')
        expect(keywordKeyOf(firstStatus(asNodes('[fanatic_rage]', matchList)), matchList)).toBe('fanatic_rage')
    })

    it('falls back to the name when the html changed', () => {
        expect(keywordKeyOf(firstStatus("<span contenteditable='false'>Burn</span>"), matchList)).toBe('burn')
    })

    it('returns null for an unknown status', () => {
        expect(keywordKeyOf(firstStatus("<span contenteditable='false'>Mystery</span>"), matchList)).toBeNull()
    })

    it.each(Object.keys(baseStatusEffect))('finds a key with the same html as %s and turns it back into the node', key => {
        const node = firstStatus(asNodes(`[${key}]`))
        const found = keywordKeyOf(node, baseStatusEffect)!
        expect(baseStatusEffect[found]).toBe(baseStatusEffect[key])
        expect(asNodes(`[${found}]`)).toBe(asNodes(`[${key}]`))
    })
})

describe('htmlToKeywordText', () => {
    it('round-trips known status effects to their keyword', () => {
        expect(htmlToKeywordText(asNodes('<p>Inflict [burn]</p>'), baseStatusEffect)).toBe('Inflict [burn]')
    })

    it('writes unknown status effects as their name', () => {
        const other = customEffectHtml(createCustomEffect({ name: 'Other Card Effect' }))
        expect(htmlToKeywordText(`<p>Gain ${other}</p>`, baseStatusEffect)).toBe('Gain Other Card Effect')
    })
})
