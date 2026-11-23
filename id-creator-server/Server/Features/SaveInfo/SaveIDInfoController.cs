using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Features.Post.DTO;
using Server.Features.Post.Service;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Repository;
using Server.Features.SaveInfo.Service;
using Server.Shared.Authorization;
using Server.Shared.Exception;
using Server.Shared.Filter;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Features.SaveInfo
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class SaveIDInfoController(ISavedInfoService<SavedIDInfo, SavedId> savedInfoService, IPostService postService, IAuthorizationService authorizationService, IMapper map): Controller
    {
        private readonly ISavedInfoService<SavedIDInfo, SavedId> _savedInfoService = savedInfoService;
        private readonly IAuthorizationService _authorizationService = authorizationService;
        private readonly IMapper _mapper = map;
        private const int MaxPageSize = 100;

        [HttpGet("{SaveId}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> GetSavedInfo(Guid SaveId,
            [FromQuery] bool includeSkill=false)
        {
            var searchResult = await _savedInfoService.FindSavedInfoById(SaveId, includeSkill)
                ?? throw new NotFoundException(ApiErrors.SaveNotFound);

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchResult.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException(ApiErrors.ResourceNotOwned);

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(searchResult)));
        }

        [HttpGet]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveListResponseDTO<SavedIDRequestDTO>>>> GetSavedInfos([FromQuery] Guid userId,
            [FromQuery] string searchName = "",
            [FromQuery] int page = 0,
            [FromQuery] int limit = 10)
        {
            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(userId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException(ApiErrors.ResourceNotOwned);

            var option = new SearchSaveParams()
            {
                Name = searchName,
                UserId = userId,
                Limit = Math.Clamp(limit, 1, MaxPageSize),
                Page = Math.Max(page, 0)
            };
            var searchResult = await _savedInfoService.FindSavedInfos(option);
            var response = searchResult.Select(_mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>).ToList();
            var postsBySave = await postService.FindPostsBySave([.. response.Select(s => s.Id)]);
            foreach (var save in response)
                save.LinkedPosts = _mapper.Map<List<LinkedPostDTO>>(postsBySave.GetValueOrDefault(save.Id) ?? []);

            return Ok(ApiResponse<SaveListResponseDTO<SavedIDRequestDTO>>.Ok(new SaveListResponseDTO<SavedIDRequestDTO>
            {
                List = response,
                Total = await _savedInfoService.CountSavedInfos(option),
            }));
        }

        [HttpDelete]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> DeleteIDSave([FromBody] Guid SaveId)
        {
            var searchSave = await _savedInfoService.FindSavedInfoById(SaveId)
                ?? throw new NotFoundException(ApiErrors.SaveNotFound);

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException(ApiErrors.ResourceNotOwned);

            var deletedSave = await _savedInfoService.DeleteSavedInfo(SaveId)
                ?? throw new NotFoundException(ApiErrors.SaveNotFound);
            await postService.UnlinkSave(SaveId);

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(deletedSave), "Deletion successful"));
        }

        [HttpPost]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<SaveInfoFilesRequestDTO>]
        [ValidationFilter<SavedIDRequestDTO>]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> CreateNewIDSave(
            [FromForm] SaveInfoFilesRequestDTO files,
            [FromForm] SavedInfoRequestDTO<SavedIDRequestDTO> SaveData)
        {
            var userId = User.GetRequiredUserId();

            var saveIDInfo = _mapper.Map<SavedIDInfo>(SaveData);
            saveIDInfo.UserId = userId;

            var newSavedInfo = await _savedInfoService.CreateSavedInfo(saveIDInfo, files);

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(newSavedInfo), "New save file created successfully"));
        }

        [HttpPut]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<SaveInfoFilesRequestDTO>]
        [ValidationFilter<SavedIDRequestDTO>]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> UpdateSave(
            [FromForm] SaveInfoFilesRequestDTO files,
            [FromForm] SavedInfoRequestDTO<SavedIDRequestDTO> SaveData)
        {
            var userId = User.GetRequiredUserId();

            var saveIDInfo = _mapper.Map<SavedIDInfo>(SaveData);
            saveIDInfo.UserId = userId;

            var updatingSave = await _savedInfoService.FindSavedInfoById(saveIDInfo.Id)
                ?? throw new NotFoundException(ApiErrors.SaveNotFound);

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(updatingSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException(ApiErrors.ResourceNotOwned);

            var newSavedInfo = await _savedInfoService.UpdateSavedInfo(saveIDInfo, files) ?? throw new NotFoundException(ApiErrors.SaveUpdateFailed);

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(newSavedInfo), "Save has been updated"));
        }
    }
}
