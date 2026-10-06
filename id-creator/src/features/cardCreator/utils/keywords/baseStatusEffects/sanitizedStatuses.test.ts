import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { sanitizeCardHtml } from 'utils/sanitizeHtml'

function structure(html: string): string[] {
    const template = document.createElement('template')
    template.innerHTML = html
    return Array.from(template.content.querySelectorAll('*')).map(element => {
        const attributes = Array.from(element.attributes).map(a => `${a.name}=${a.value}`).sort().join(' ')
        return `${element.tagName.toLowerCase()}[${attributes}]`
    }).concat(template.content.textContent ?? '')
}

describe('built-in status effects survive sanitizing', () => {
    it.each(Object.entries(baseStatusEffect))('%s keeps its markup', (_key, html) => {
        expect(structure(sanitizeCardHtml(html))).toEqual(structure(html))
    })
})
