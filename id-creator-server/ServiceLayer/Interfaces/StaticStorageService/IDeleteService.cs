namespace ServiceLayer.Interfaces.StaticStorageService
{
    public interface IDeleteService
    {
        Task Delete(string publicId);
    }
}