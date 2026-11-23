namespace Server.Features.Post.DTO
{
    public class PostListItemDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<string> ImagesAttach { get; set; } = [];
        public string UserIcon { get; set; } = "";
        public string UserName { get; set; } = "";
        public Guid UserId { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public List<string> Tags { get; set; } = [];
        public int ViewCount { get; set; } = 0;
        public int CommentCount { get; set; } = 0;
        public bool HasCards { get; set; }
    }

    public class PostSlideDTO
    {
        public string ImageUrl { get; set; } = "";
        public PostCardResponseDTO? Card { get; set; }
    }

    public class PostResponseDTO : PostListItemDTO
    {
        public List<PostSlideDTO> Slides { get; set; } = [];
    }
}
