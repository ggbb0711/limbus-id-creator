namespace Server.Features.Comment.Repository
{
    public class SearchCommentOption
    {
        public Guid PostId { get; set; }
        public int Page { get; set; }=0;
        public int Limit { get; set; }=10;
    }
}
