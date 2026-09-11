namespace Server.Shared.CloudStorage.Service
{
    public interface IDeleteService
    {
        Task Delete(string publicId);
    }
}
