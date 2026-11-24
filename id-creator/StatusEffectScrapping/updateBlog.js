const fs = require("fs/promises")
const { STATUS_EFFECTS_DIR, STATUSES_DIR, BLOG_POST_PATH } = require("./constants")

const sections = [
    { heading: "### Triggers", file: `${STATUS_EFFECTS_DIR}/triggers.json`, withDescription: false },
    { heading: "### Buffs", file: `${STATUSES_DIR}/buff.json`, withDescription: true },
    { heading: "### Debuffs", file: `${STATUSES_DIR}/debuff.json`, withDescription: true },
    { heading: "### Neutral", file: `${STATUSES_DIR}/neutral.json`, withDescription: true },
]

const toKeywordKey = name => name.replace(/\s/g, "_").toLowerCase()

const escapeCell = text => text.replace(/([\\`*_|[\]<>])/g, "\\$1")

function uniqueEntries(statuses){
    const keysByLook = new Map()
    Object.keys(statuses).sort().forEach(key => {
        const { name, image, color } = statuses[key]
        const look = JSON.stringify([name, image, color])
        keysByLook.set(look, [...(keysByLook.get(look) ?? []), key])
    })
    return [...keysByLook.values()]
        .map(keys => keys.find(key => key === toKeywordKey(statuses[key].name)) ?? keys[0])
        .sort()
        .map(key => statuses[key])
}

function buildTable(statuses, withDescription){
    const rows = uniqueEntries(statuses).map(({ key, name, description }) => {
        const cells = [`\`[${key}]\``, name]
        if (withDescription) cells.push(escapeCell(description.split("\n").join(" ")))
        return `| ${cells.join(" | ")} |`
    })
    const header = withDescription
        ? ["| Keyword | Shows as | Description |", "| --- | --- | --- |"]
        : ["| Keyword | Shows as |", "| --- | --- |"]
    return [...header, ...rows].join("\n")
}

function replaceTable(markdown, heading, table){
    const headingIndex = markdown.indexOf(`\n${heading}\n`)
    if (headingIndex < 0) throw new Error(`Missing heading ${heading}`)
    const tableStart = markdown.indexOf("\n| Keyword |", headingIndex) + 1
    if (tableStart === 0) throw new Error(`Missing table under ${heading}`)
    const lines = markdown.slice(tableStart).split("\n")
    const tableLength = lines.findIndex(line => !line.startsWith("|"))
    const tableEnd = tableStart + lines.slice(0, tableLength < 0 ? lines.length : tableLength).join("\n").length
    return markdown.slice(0, tableStart) + table + markdown.slice(tableEnd)
}

async function updateBlog(){
    let markdown = await fs.readFile(BLOG_POST_PATH, "utf-8")
    for (const { heading, file, withDescription } of sections) {
        const statuses = JSON.parse(await fs.readFile(file, "utf-8"))
        markdown = replaceTable(markdown, heading, buildTable(statuses, withDescription))
    }
    await fs.writeFile(BLOG_POST_PATH, markdown, "utf-8")
    console.log(`Updated ${BLOG_POST_PATH}`)
}

if (require.main === module) updateBlog()

module.exports = { updateBlog }
