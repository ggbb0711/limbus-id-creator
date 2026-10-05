export default function checkBase64Image(data:string = ""):boolean{
    return (data.match(/data:image\/[^;]+;base64[^"]+/g) ?? []).length > 0
}
    