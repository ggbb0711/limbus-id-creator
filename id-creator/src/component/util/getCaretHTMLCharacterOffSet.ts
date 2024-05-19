import loopThroughHTML from "./loopThroughHTML"

//Get caret position that includes html tags and attributes
export default function getCaretHTMLCharacterOffSet (HTMLString:string,caretCharacterOffset:number){
    const innerHTML = HTMLString
    let HTMLCounter =0
    let textCounter = 0
    if(innerHTML[HTMLCounter]==="<"){
        HTMLCounter=loopThroughHTML(innerHTML,HTMLCounter)
    }
    while(textCounter<caretCharacterOffset){
        HTMLCounter++
        if(innerHTML[HTMLCounter]==="<"){
            HTMLCounter=loopThroughHTML(innerHTML,HTMLCounter)
        }
        if(innerHTML[HTMLCounter]!==">"&&innerHTML[HTMLCounter]!=="<")textCounter++;
    }
    return HTMLCounter
}
