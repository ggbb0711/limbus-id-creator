using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Requests.SavedInfo;
using Server.DTOs.Requests.SavedInfo.SavedEgo;
using Server.DTOs.Response.SaveInfo;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Util.ApiException;
using Server.Util.Authorization;
using Server.Util.Obj;

namespace Server.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class SaveEGOInfoController(ISavedInfoService<SavedEGOInfo> savedInfoService, IAuthorizationService authorizationService, IMapper map): Controller
    {
        private readonly ISavedInfoService<SavedEGOInfo> _savedInfoService = savedInfoService;
        private readonly IAuthorizationService _authorizationService = authorizationService;
        private readonly IMapper _mapper = map;

        [HttpGet("{SaveId}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>>> GetSavedInfo(Guid SaveId,
            [FromQuery] bool includeSkill=false)
        {
            var searchResult = await _savedInfoService.FindSavedInfoById(SaveId, includeSkill)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchResult.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(searchResult)));
        }

        [HttpGet("")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<SaveInfoResponseDTO<SavedEgoRequestDTO>>>>> GetSavedInfos([FromQuery] Guid userId,
            [FromQuery] string searchName = "",
            [FromQuery] int page = 0,
            [FromQuery] int limit = 10)
        {
            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(userId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            var option = new SearchSaveParams()
            {
                Name = searchName,
                UserId = userId,
                Limit = limit,
                Page = page
            };
            var searchResult = await _savedInfoService.FindSavedInfos(option);
            var response = searchResult.Select(_mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>).ToList();

            return Ok(ApiResponse<List<SaveInfoResponseDTO<SavedEgoRequestDTO>>>.Ok(response));
        }

        [HttpPost("delete")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>>> DeleteIDSave([FromBody] Guid SaveId)
        {
            var searchSave = await _savedInfoService.FindSavedInfoById(SaveId)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            var deletedSave = await _savedInfoService.DeleteSavedInfo(SaveId)
                ?? throw new NotFoundException("Save does not exist");

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(deletedSave), "Deletion successful"));
        }

        [HttpPost("create")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>>> CreateNewIDSave(
            [FromForm] List<IFormFile> skillImages, [FromForm] int[] imageIndex,[FromForm] IFormFile? thumbnailImage,[FromForm] IFormFile? splashArtImg,[FromForm] IFormFile? sinnerIcon)
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");

            // TODO: replace this with a FluentValidation validator (e.g. for the upload payload) so
            // ValidationActionFilter enforces it automatically: skillImages.Count <= 40, and
            // imageIndex.Length == skillImages.Count.

            var saveIDInfo = (SavedEGOInfo?) HttpContext.Items["SaveData"]
                ?? throw new BadRequestException("Save data is not formatted correctly");
            saveIDInfo.UserId = userId;

            var newSavedInfo = await _savedInfoService.CreateSavedInfo(saveIDInfo, new SaveInfoFilesRequestDTO()
            {
                SkillImages = skillImages.Select((image, idx) => new SkillImageEntry { Image = image, Index = imageIndex[idx] }).ToList(),
                ThumbnailImage = thumbnailImage,
                SplashArtImg = splashArtImg,
                SinnerIcon = sinnerIcon
            });

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(newSavedInfo), "New save file created successfully"));
        }

        [HttpPost("update")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>>> UpdateSave(
            [FromForm] List<IFormFile> skillImages, [FromForm] int[] imageIndex,[FromForm] IFormFile? thumbnailImage,[FromForm] IFormFile? splashArtImg,[FromForm] IFormFile? sinnerIcon)
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");

            // TODO: replace this with a FluentValidation validator (e.g. for the upload payload) so
            // ValidationActionFilter enforces it automatically: skillImages.Count <= 40, and
            // imageIndex.Length == skillImages.Count.

            var saveIDInfo = (SavedEGOInfo?) HttpContext.Items["SaveData"]
                ?? throw new BadRequestException("Save data is not formatted correctly");
            saveIDInfo.UserId = userId;

            var updatingSave = await _savedInfoService.FindSavedInfoById(saveIDInfo.Id)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(updatingSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            var newSavedInfo = await _savedInfoService.UpdateSavedInfo(saveIDInfo, new SaveInfoFilesRequestDTO()
            {
                SkillImages = skillImages.Select((image, idx) => new SkillImageEntry { Image = image, Index = imageIndex[idx] }).ToList(),
                ThumbnailImage = thumbnailImage,
                SplashArtImg = splashArtImg,
                SinnerIcon = sinnerIcon
            }) ?? throw new NotFoundException("Cannot update save");

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(newSavedInfo), "Save has been updated"));
        }
    }
}
