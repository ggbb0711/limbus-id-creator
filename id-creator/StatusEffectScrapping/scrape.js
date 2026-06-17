//Objective of this script is to scrape the limbus wiki status effect page to get All of the status effects we are missing
//1. Use this: document.querySelectorAll("div.ext-bigtable-wrapper tr > td:first-child > span.advanced-tooltip.tooltips-init-complete")
// To get all the span that has the image with the url we need to check for misssing status effect.
// 2. After that we target the image and then extract the image name out of the url
// 3. Check if the name already exist in our public folder
// 4. If not then write them out to an object using:
// [image_name]:{
//  key,
//  value,
//  type: buff/debuff/neutral
//}
// Write this object out to a json file
const { chromium } = require('playwright-extra');
const fs = require('fs/promises')
const stealth = require('puppeteer-extra-plugin-stealth');


chromium.use(stealth());

async function loadingOldStatusData(){
    const baseUrl = "../src/Features/CardCreator/Utils/BaseStatusEffects/Statuses"
    const statusArray = await Promise.all([
        fs.readFile(`${baseUrl}/buff.json`,'utf-8'),
        fs.readFile(`${baseUrl}/debuff.json`,'utf-8'),
        fs.readFile(`${baseUrl}/neutral.json`,'utf-8'),
    ])
    return statusArray
        .map(statuses=>Object.keys(JSON.parse(statuses)))
        .flat()
}

async function scrape (){
    const oldStatusData = await loadingOldStatusData()
    const browser = await chromium.launch({ headless: true , slowMo: 50})
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        locale: 'en-US',
        timezoneId: 'America/New_York',
    })
    const page = await context.newPage()

    await page.goto("https://limbuscompany.wiki.gg/wiki/Status_Effects",{
        waitUntil: 'domcontentloaded',
        timeout: 60000 
    })

    await page.waitForLoadState('networkidle');

    // Minor interaction simulation to pass behavioral analysis
    await page.mouse.move(200, 300, { steps: 10 });
    await page.evaluate(() =>{ 
        window.scrollBy(0, window.innerHeight / 4)
    });

    const statusEffectSpans = (await page.$$eval("div.ext-bigtable-wrapper tr > td:first-child > span.advanced-tooltip.tooltips-init-complete", spans=>{
        return spans
        .filter(span=>span.querySelector("span")) //Filter empty name
        .map(span=>{
            const statusMap = {
                "#fac400": "Buff",
                "#e20000": "Debuff",
                "#9f6a3a": "Neutral"
            }

            const imgSrc = span.querySelector("img").getAttribute("src")
            const url = new URL(imgSrc, "https://limbuscompany.wiki.gg")
            const imgName = url.pathname.split("/").pop()
            const transformedImgName = (imgName
                .replace(/^\d+px-/, "") //Filter out the px prefix
                .replace(/\.[^.]+$/, "")) //Filter out the extension
            
            const statusEffectNameSpan = span.querySelector("span")
            const statusEffectName = statusEffectNameSpan.textContent;
            const nameKey = statusEffectName.toLowerCase().replaceAll(" ","_")
            const statusEffectType = statusMap[statusEffectNameSpan.getAttribute("style").match(/color:\s*(#[0-9a-fA-F]{3,8})/)[1]]
            return {
                img: transformedImgName,
                downloadUrl: url.href,
                nameKey, 
                type: statusEffectType.toLowerCase(),
                value: `<span class='center-element' contenteditable='false' style='color:var(--${statusEffectType}-color);text-decoration:underline;'><img class='status-icon' src='/Images/status-effect/${transformedImgName}.webp' alt='${encodeURIComponent(nameKey)}_icon' />${statusEffectName}</span>`,
            }
        })
    }))
    .filter(status=>!oldStatusData.includes(status.nameKey))
    console.log("Status effect spans: ",statusEffectSpans)
    await fs.writeFile("temp.json",JSON.stringify(statusEffectSpans, null, 2),'utf-8')
}

scrape()
// const cheerio = require("cheerio");

// (async ()=>{
//     const siteHTML = await fetch("https://limbuscompany.wiki.gg/wiki/Status_Effects")
//     if(siteHTML.ok){
//         const html = await siteHTML.text()
//         const $ = cheerio.load(html)
//         const statusEffectSpans = $("div.ext-bigtable-wrapper tr > td:first-child > span.advanced-tooltip.tooltips-init-complete")
//             // .map((index,spanElement)=>({
//             //     img: $(spanElement).attr("src"),
//             //     name: $(spanElement)
//             // }))
//         console.log(statusEffectSpans)
//     }
// })()