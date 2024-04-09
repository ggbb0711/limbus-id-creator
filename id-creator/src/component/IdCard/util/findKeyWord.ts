export default function findKeyWord(term:string,keyWord:{[key:string]:string}):Array<Array<string>>{
    const arr=Object.keys(keyWord).map(key=>[key,keyWord[key]]).filter(value=>value[0].match(term))
    
    return arr
}