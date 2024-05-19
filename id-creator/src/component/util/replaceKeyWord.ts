export default function replaceKeyWord(str:string,keyWord:{[key:string]:string}):string{
    const suggestions=str.match(/\[([^ ]+)\](?!<([^ ]+)>)/g)
    if(suggestions){
        suggestions.forEach(suggestion=>{
            if(keyWord[suggestion.slice(1,suggestion.length-1).toLowerCase()]){
                str=str.replace(suggestion,keyWord[suggestion.slice(1,suggestion.length-1).toLowerCase()])
            }
        })
    }

    return str
}