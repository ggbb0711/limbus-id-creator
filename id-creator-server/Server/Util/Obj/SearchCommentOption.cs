namespace Server.Obj
{
    public class SearchCommentOption
    {
        public string PostId { get; set; }
        public int page { get; set; }=0;
        public int limit { get; set; }=10;
    }
}