using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.IPostService;
using Server.Models;
using Server.Util;
using Server.Util.Enums;
using Server.Util.Obj;
using Server.Util.RabbitMQPublisher;

namespace Server.Services.PostService
{
    public class PostService(IPostRepository postRepository, ICommentRepository commentRepository, RabbitMQUploadingImagePublisher publisher) : IPostService
    {
        public async Task<Post> CreatePost(Post newPost)
        {
            List<ImageObj> images = [.. newPost.ImageAttaches];
            var res = await postRepository.AddAsync(newPost);
            await postRepository.SaveChangeAsync();
            UploadImageToRabbitMQ(images);
            return res;
        }

        public async Task<Post?> GetPostById(Guid postId)
        {
            return await postRepository.GetByIdAsync(postId);
        }

        public async Task<List<Post>> FindPosts(SearchPostOption option)
        {
            return [.. await postRepository.FindAsync(new RepositoryGetParams<Post>()
            {
                Filter = p=>p.Title.Contains(option.Title, StringComparison.CurrentCultureIgnoreCase)
                    &&(option.UserId == null||option.UserId == p.UserId)
                    &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
                    && !p.IsRemoved && p.IsActive,
                OrderBy = query => option.SortedBy switch
                    {
                        PostSortOption.Title => query.OrderBy(p => p.Title),
                        PostSortOption.MostViewed => query.OrderByDescending(post=> postRepository.GetPostCount(option)),
                        PostSortOption.MostCommented => query.OrderByDescending(p => commentRepository.GetCommentCount(p.Id)),
                        PostSortOption.Earliest => query.OrderBy(p => p.Created),
                        _ => query.OrderByDescending(p => p.Created),
                    },
                Skip = option.limit * option.page,
                Take = option.limit
            })];
        }

        public int GetPostCount(SearchPostOption option)
        {
            return postRepository.GetPostCount(option);
        }

        private void UploadImageToRabbitMQ(List<ImageObj> imageObjs)
        {
            imageObjs.ForEach(image =>
            { 
                if(FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,",""))) publisher.PushBase64StringToRabbitMQ(image.Id,image.Url.Replace("data:image/png;base64,",""),image.LastUpdated);
                else if(Uri.TryCreate(image.Url, UriKind.Absolute, out _)) publisher.PushURLStringToRabbitMQ(image.Id, image.Url, image.LastUpdated);
            });
        }

    }
}