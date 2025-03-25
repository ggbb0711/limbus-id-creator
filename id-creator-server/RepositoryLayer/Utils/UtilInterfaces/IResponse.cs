


namespace RepositoryLayer.Utils.UtilInterfaces
{
    public interface IResponse<TResponseType>
    {
        public TResponseType? Response { get; set; }
        public string msg { get; set; }
    }
}