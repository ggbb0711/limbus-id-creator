import keyword from './keyword.json'
import buff from './statuses/buff.json'
import debuff from './statuses/debuff.json'
import neutral from './statuses/neutral.json'

it('defines each status effect key in only one file', () => {
    const files: Record<string, Record<string, string>> = { keyword, buff, debuff, neutral }
    const owners: Record<string, string[]> = {}
    for (const [file, entries] of Object.entries(files)) {
        for (const key of Object.keys(entries)) (owners[key] ??= []).push(file)
    }
    const duplicates = Object.entries(owners).filter(([, files]) => files.length > 1)
    expect(duplicates).toEqual([])
})
