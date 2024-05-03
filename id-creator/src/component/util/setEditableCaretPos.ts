const setEditableCaretPos = (contentEle:HTMLElement,targetPosition:number) => {
    if(targetPosition===-1) return -1
    let finished = false
    contentEle.childNodes.forEach(node=>{
        if(!finished){
            if(node.nodeType===3){//Text node
                if(node.textContent.length>=targetPosition){
                    const range = document.createRange()
                    const sel = window.getSelection()
                    range.setStart(node,targetPosition)
                    range.collapse(true)
                    sel.removeAllRanges()
                    sel.addRange(range)
                    finished = true//Done
                }else{
                    targetPosition-=node.textContent.length
                }
            }
            else{
                targetPosition = setEditableCaretPos((node as HTMLElement),targetPosition)
                if(targetPosition===-1){
                    finished = true
                }
            }
        }
        
    })
    return (finished)?-1:targetPosition//Done
}

export default setEditableCaretPos