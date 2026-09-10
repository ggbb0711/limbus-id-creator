using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Requests.SavedInfo;
using Server.DTOs.Requests.SavedInfo.SavedID;
using Server.DTOs.Response.SaveInfo;
using Server.Filters;
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
    public class SaveIDInfoController(ISavedInfoService<SavedIDInfo, SavedId> savedInfoService, IAuthorizationService authorizationService, IMapper map): Controller
    {
        private readonly ISavedInfoService<SavedIDInfo, SavedId> _savedInfoService = savedInfoService;
        private readonly IAuthorizationService _authorizationService = authorizationService;
        private readonly IMapper _mapper = map;

        [HttpGet("{SaveId}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> GetSavedInfo(Guid SaveId,
            [FromQuery] bool includeSkill=false)
        {
            var searchResult = await _savedInfoService.FindSavedInfoById(SaveId, includeSkill)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchResult.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(searchResult)));
        }

        [HttpGet]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<SaveInfoResponseDTO<SavedIDRequestDTO>>>>> GetSavedInfos([FromQuery] Guid userId,
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
            var response = searchResult.Select(_mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>).ToList();

            return Ok(ApiResponse<List<SaveInfoResponseDTO<SavedIDRequestDTO>>>.Ok(response));
        }

        [HttpDelete]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>>> DeleteIDSave([FromBody] Guid SaveId)
        {
            var searchSave = await _savedInfoService.FindSavedInfoById(SaveId)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(searchSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            var deletedSave = await _savedInfoService.DeleteSavedInfo(SaveId)
                ?? throw new NotFoundException("Save does not exist");

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
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");

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
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");

            var saveIDInfo = _mapper.Map<SavedIDInfo>(SaveData);
            saveIDInfo.UserId = userId;

            var updatingSave = await _savedInfoService.FindSavedInfoById(saveIDInfo.Id)
                ?? throw new NotFoundException("Save does not exist");

            var authResult = await _authorizationService.AuthorizeAsync(User, new OwnedResource(updatingSave.UserId), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You do not own this resource.");

            var newSavedInfo = await _savedInfoService.UpdateSavedInfo(saveIDInfo, files) ?? throw new NotFoundException("Cannot update save");

            return Ok(ApiResponse<SaveInfoResponseDTO<SavedIDRequestDTO>>.Ok(
                _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(newSavedInfo), "Save has been updated"));
        }
    }
}
