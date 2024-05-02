export default function getCaretHTMLCharacterOffSet (HTMLString:string,caretCharacterOffset:number){
    const innerHTML = HTMLString
    let HTMLCounter =0
    let textCounter = 0
    if(innerHTML[HTMLCounter]==="<"){
        HTMLCounter=loopThourghHTMLTag(innerHTML,HTMLCounter)
    }
    while(textCounter<caretCharacterOffset){
        HTMLCounter++
        if(innerHTML[HTMLCounter]==="<"){
            HTMLCounter=loopThourghHTMLTag(innerHTML,HTMLCounter)
        }
        if(innerHTML[HTMLCounter]!==">"&&innerHTML[HTMLCounter]!=="<")textCounter++;
    }
    return HTMLCounter
}

function loopThourghHTMLTag(innerHTML:string,HTMLCounter:number){
    while(true){
        HTMLCounter++
        if(innerHTML[HTMLCounter]===">"){
            return HTMLCounter
        }
    }
}