const fs = require("fs/promises")
const axios = require('axios')
const sharp = require('sharp')

const baseStatusUrl = "../src/Features/CardCreator/Utils/BaseStatusEffects/Statuses"
const baseDownloadUrlFolder = "../public/Images/status-effect"


async function loadingOldStatusData(){
    const [buffStatuses,debuffStatuses,neutralStatuses] = await Promise.all([
        fs.readFile(`${baseStatusUrl}/buff.json`,'utf-8'),
        fs.readFile(`${baseStatusUrl}/debuff.json`,'utf-8'),
        fs.readFile(`${baseStatusUrl}/neutral.json`,'utf-8'),
    ])
    return {
        buff: JSON.parse(buffStatuses),
        debuff: JSON.parse(debuffStatuses),
        neutral: JSON.parse(neutralStatuses)
    }
}

async function downloadImages(newStatuses){
    for(const status of newStatuses){
        try{
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            const response = await axios.get(status.downloadUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            const decodedImageName = decodeURIComponent(status.img)

            console.log(`Downloading: ${decodedImageName}...`)
            await sharp(imageBuffer)
                .webp()
                .toFile(`${baseDownloadUrlFolder}/${decodedImageName}.webp`);
            console.log(`Downloading: ${decodedImageName}, completed`)
        }
        catch(err){
            console.log(err)
        }
    }
}

async function updateSatuses(oldStatuses,newStatuses){
    newStatuses.forEach(status=>{
        oldStatuses[status.type][status.nameKey] = status.value
    })
    await Promise.all([
        fs.writeFile(`${baseStatusUrl}/buff.json`,JSON.stringify(oldStatuses.buff,null,2),'utf-8'),
        fs.writeFile(`${baseStatusUrl}/debuff.json`,JSON.stringify(oldStatuses.debuff,null,2),'utf-8'),
        fs.writeFile(`${baseStatusUrl}/neutral.json`,JSON.stringify(oldStatuses.neutral,null,2),'utf-8')
    ])
}

async function downloadAndUpdate(){
    const newStatuses = JSON.parse(await fs.readFile("temp.json","utf-8"))
    const statuses = await loadingOldStatusData()
    await Promise.all([downloadImages(newStatuses),updateSatuses(statuses,newStatuses)])
}
downloadAndUpdate()