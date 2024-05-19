import loopThroughHTML from "./loopThroughHTML";

export default function getTextInTag(HTMLInput:string){
    let res="";
    for (let i = 0; i < HTMLInput.length; i++) {
        if(HTMLInput[i]==="<"){
            i=loopThroughHTML(HTMLInput,i)
            continue
        }
        res+=HTMLInput[i]
    }
    return res;
}