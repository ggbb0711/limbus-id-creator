export default function getImageDimensions (file:File):Promise<{width:number,height:number}> {
    return new Promise((resolve,reject)=>{
        try {
            let img = new Image()
    
            img.onload = () => {
                const width  = img.naturalWidth,
                      height = img.naturalHeight
    
                window.URL.revokeObjectURL(img.src)
    
                return resolve({width, height})
            }
    
            img.src = window.URL.createObjectURL(file)
        } catch (exception) {
            return reject(exception)
        }
    })
}