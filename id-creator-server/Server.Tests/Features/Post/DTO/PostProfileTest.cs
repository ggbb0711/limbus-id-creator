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

        [Fact]
        public void PostResponse_HasOneSlidePerVisibleImageWithItsCard()
        {
            var cardB = new PostCard { Id = Guid.NewGuid(), Position = 0, ImageUrl = "b" };
            var cardA = new PostCard { Id = Guid.NewGuid(), Position = 1, ImageUrl = "a" };
            var post = new PostModel
            {
                ImageAttaches =
                [
                    new ImageObj { Url = "a" },
                    new ImageObj { Url = "plain" },
                    new ImageObj { Url = "removed", Status = AssetStatus.Deleted },
                    new ImageObj { Url = "b" },
                ],
                Cards = [cardB, cardA],
            };

            var response = _mapper.Map<PostResponseDTO>(post);

            Assert.Equal(["a", "plain", "b"], response.Slides.Select(s => s.ImageUrl));
            Assert.Equal(cardA.Id, response.Slides[0].Card!.Id);
            Assert.Null(response.Slides[1].Card);
            Assert.Equal(cardB.Id, response.Slides[2].Card!.Id);
            Assert.True(response.HasCards);
        }

        [Fact]
        public void PostResponse_UsesEachCardOnce_WhenImagesRepeat()
        {
            var first = new PostCard { Id = Guid.NewGuid(), Position = 0, ImageUrl = "x" };
            var second = new PostCard { Id = Guid.NewGuid(), Position = 1, ImageUrl = "x" };
            var post = new PostModel
            {
                ImageAttaches = [new ImageObj { Url = "x" }, new ImageObj { Url = "x" }, new ImageObj { Url = "x" }],
                Cards = [second, first],
            };

            var slides = _mapper.Map<PostResponseDTO>(post).Slides;

            Assert.Equal(first.Id, slides[0].Card!.Id);
            Assert.Equal(second.Id, slides[1].Card!.Id);
            Assert.Null(slides[2].Card);
        }

        [Fact]
        public void PostResponse_DropsCardsWhoseImageIsNotShown()
        {
            var post = new PostModel
            {
                ImageAttaches = [new ImageObj { Url = "a" }, new ImageObj { Url = "gone", Status = AssetStatus.Deleted }],
                Cards = [new PostCard { ImageUrl = "gone" }],
            };

            var slides = _mapper.Map<PostResponseDTO>(post).Slides;

            Assert.Null(Assert.Single(slides).Card);
        }

        [Fact]
        public void PostResponse_HasNoSlides_WhenThereAreNoImages()
        {
            var post = new PostModel { Cards = [new PostCard { ImageUrl = "a" }] };

            Assert.Empty(_mapper.Map<PostResponseDTO>(post).Slides);
        }

        [Fact]
        public void PostResponse_HasNoCards_WhenThePostHasOnlyImages()
        {
            var post = new PostModel { ImageAttaches = [new ImageObj { Url = "a" }] };

            var response = _mapper.Map<PostResponseDTO>(post);

            Assert.False(response.HasCards);
            Assert.Null(Assert.Single(response.Slides).Card);
        }

        [Fact]
        public void PostListItem_TakesHasCardsFromThePostIdsPassedIn()
        {
            var withCard = new PostModel { Id = Guid.NewGuid() };
            var withoutCard = new PostModel { Id = Guid.NewGuid() };
            IReadOnlyCollection<Guid> ids = [withCard.Id];

            Assert.True(_mapper.Map<PostListItemDTO>(withCard, opt => opt.Items[PostProfile.PostIdsWithCards] = ids).HasCards);
            Assert.False(_mapper.Map<PostListItemDTO>(withoutCard, opt => opt.Items[PostProfile.PostIdsWithCards] = ids).HasCards);
        }

        [Fact]
        public void PostListItem_HasNoCards_WhenNoPostIdsArePassed()
        {
            Assert.False(_mapper.Map<PostListItemDTO>(new PostModel { Id = Guid.NewGuid() }).HasCards);
        }
    }
}
