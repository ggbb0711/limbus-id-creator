export default function replaceKeyWord(str:string,keyWord:{[key:string]:string}):string{
    const suggestions=str.match(/\[([^ ]+)\](?!<([^ ]+)>)/g)
    if(suggestions){
        suggestions.forEach(suggestion=>{
            const selectedWord = keyWord[decodeAmpersand(suggestion.slice(1,suggestion.length-1).toLowerCase())]
            if(selectedWord){
                str=str.replace(suggestion,selectedWord)
            }
        })
    }

    return str
}

function decodeAmpersand(input:string) {
    return input.replace(/&amp;/g, '&');
}