const setEditableCaretPos = (contentEle:HTMLElement,targetPosition:number) => {
    contentEle.childNodes.forEach(node=>{
        if(node.nodeType===3){//Text node
            if(node.textContent.length>=targetPosition){
                const range = document.createRange()
                const sel = window.getSelection()
                range.setStart(node,targetPosition)
                range.collapse(true)
                sel.removeAllRanges()
                sel.addRange(range)
                return -1//Done
            }else{
                targetPosition-=node.textContent.length
            }
        }
        else{
            targetPosition = setEditableCaretPos((node as HTMLElement),targetPosition)
            if(targetPosition===-1){
                return -1
            }
        }
    })
    return targetPosition//Done
}

export default setEditableCaretPos