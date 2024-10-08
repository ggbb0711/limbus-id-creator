



using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.IPostService;
using Server.Models;
using Server.Util;
using Server.Util.Obj;
using Server.Util.RabbitMQPublisher;

namespace Server.Services.PostService
{
    public class PostService(IPostRepository postRepository, RabbitMQUploadingImagePublisher publisher) : IPostService
    {
        private readonly IPostRepository _postRepository = postRepository;
        private readonly RabbitMQUploadingImagePublisher _publisher = publisher;
        public async Task<Post?> CreatePost(Post newPost)
        {
            List<ImageObj> images = [.. newPost.ImageAttaches];
            var res = await _postRepository.CreatePost(newPost);
            uploadImageToRabbitMQ(images);
            return res;
        }

        public async Task<Post?> FindPostById(Guid postId)
        {
            return await _postRepository.GetPostById(postId);
        }

        public async Task<List<Post>> FindPosts(SearchPostOption option)
        {
            return await _postRepository.GetPosts(option);
        }

        public int GetPostCount(SearchPostOption option)
        {
            return _postRepository.GetPostCount(option);
        }

        private void uploadImageToRabbitMQ(List<ImageObj> imageObjs)
        {
            imageObjs.ForEach(image =>
            { 
                if(FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,","")))_publisher.PushBase64StringToRabbitMQ(image.Id,image.Url.Replace("data:image/png;base64,",""),image.LastUpdated);
                else if(Uri.TryCreate(image.Url, UriKind.Absolute, out _)) _publisher.PushURLStringToRabbitMQ(image.Id, image.Url, image.LastUpdated);
            });
        }

    }
}