export default function loopThroughHTML(innerHTML:string,HTMLCounter:number){
    while(true){
        HTMLCounter++
        if(innerHTML[HTMLCounter]===">"){
            return HTMLCounter
        }
    }
}