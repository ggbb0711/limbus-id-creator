using AutoMapper;
using Server.Features.Images.Enum;
using Server.Features.Post.DTO;
using Server.Shared.Model;
using PostModel = Server.Shared.Model.Post;

namespace Server.Tests.Features.Post.DTO
{
    public class PostProfileTest
    {
        private readonly IMapper _mapper = new MapperConfiguration(cfg => cfg.AddProfile<PostProfile>()).CreateMapper();

        [Fact]
        public void PostResponse_SkipsDeletedImages()
        {
            var post = new PostModel
            {
                ImageAttaches =
                [
                    new ImageObj { Url = "kept" },
                    new ImageObj { Url = "removed", Status = AssetStatus.Deleted },
                ],
            };

            var response = _mapper.Map<PostResponseDTO>(post);

            Assert.Equal(["kept"], response.ImagesAttach);
        }

        [Fact]
        public void PostCardResponse_IncludesCardId()
        {
            var card = new PostCard { Id = Guid.NewGuid(), ImageUrl = "img" };

            var response = _mapper.Map<PostCardResponseDTO>(card);

            Assert.Equal(card.Id, response.Id);
        }
    }
}
