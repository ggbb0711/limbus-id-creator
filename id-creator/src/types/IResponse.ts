

export default interface IResponse<ResponseType>
{
    success:boolean,
    data:ResponseType,
    message:string,
    errorCode:string|null
}