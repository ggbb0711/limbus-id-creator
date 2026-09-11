namespace Server.Shared.Model.Interface
{
    public interface IImageAttach
    {
        ImageObj ImageAttach { get; set; }
        Guid ImageAttachId { get; set; }
    }
}
