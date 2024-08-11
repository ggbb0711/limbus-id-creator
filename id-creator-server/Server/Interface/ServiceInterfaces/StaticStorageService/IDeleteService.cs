namespace Server.Interface.ServiceInterface.StaticStorageService
{
    public interface IDeleteService
    {
        Task Delete(string publicId);
    }
}