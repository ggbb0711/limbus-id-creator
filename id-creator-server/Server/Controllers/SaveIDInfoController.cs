using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Requests.SavedInfo.SavedID;
using Server.DTOs.Response.SaveInfo;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Models;
using Server.Services;
using Server.Util.Obj;

namespace Server.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class SaveIDInfoController(ISavedInfoService<SavedIDInfo> savedInfoService, IMapper map): Controller
    {
        private readonly ISavedInfoService<SavedIDInfo> _savedInfoService = savedInfoService;
        private readonly IMapper _mapper = map;

        [HttpGet("{SaveId}")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> GetSavedInfo(string SaveId,
            [FromQuery] bool includeSkill=false)
        {
            var response = new ResponseService<SaveInfoResponseDTO<SavedIDRequestDTO>>();
            var session = (Session?) HttpContext.Items["Session"];
            if(session == null)
            {
                response.msg= "Unauthorized access to private data";
                return StatusCode(401,response);
            }
            try
            {
                var isGuid = Guid.TryParse(SaveId, out _);
                if(!isGuid)
                {
                    response.msg = "Incorrect id format";
                    return BadRequest(response);
                }
                var searchResult = await _savedInfoService.FindSavedInfoById(new Guid(SaveId),includeSkill);
                if(searchResult==null)
                {
                    return Ok(response);
                }
                else if(!searchResult.UserId.ToString().Equals(session.UserId.ToString()))
                {
                    response.msg= "User id does not match";
                    return StatusCode(401,response);
                }
                Console.WriteLine(searchResult.SavedId);
                response.Response = _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(searchResult);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                response.msg = "Something went wrong";
                return StatusCode(500,response);
            }
        }

        [HttpGet("")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> GetSavedInfos([FromQuery] string userId,
            [FromQuery] string searchName = "",
            [FromQuery] int page = 0,
            [FromQuery] int limit = 10)
        {
            var response = new ResponseService<List<SaveInfoResponseDTO<SavedIDRequestDTO>>>();
            var session = (Session?) HttpContext.Items["Session"];
            if(session == null||!session.UserId.ToString().Equals(userId))
            {
                response.msg= "Unauthorized access to private data";
                return StatusCode(401,response);
            }

            var option = new SearchSaveParams()
            {
                searchName = searchName,
                userId = userId,
                limit = limit,
                page = page
            };
            try
            {
                var searchResult = await _savedInfoService.FindSavedInfos(option);
                response.msg = "Found Save";
                response.Response = searchResult.Select(_mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>).ToList();
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                response.msg = "Something went wrong";
                return StatusCode(500,response);
            }
        }

        [HttpPost("delete")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> DeleteIDSave([FromBody] string SaveId)
        {
            var response = new ResponseService<SaveInfoResponseDTO<SavedIDRequestDTO>>();
            var session = (Session?) HttpContext.Items["Session"];


            if(session == null)
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }

            try
            {
                var isGuid = Guid.TryParse(SaveId, out _);
                if(!isGuid)
                {
                    response.msg = "Incorrect id format";
                    return BadRequest(response);
                }
                var searchSave = await _savedInfoService.FindSavedInfoById(Guid.Parse(SaveId));
                SavedIDInfo? deletedSave;
                if(searchSave?.UserId!=session.UserId)
                {
                    response.msg = "User id does not match";
                    return BadRequest(response);
                }
                deletedSave = await _savedInfoService.DeleteSavedInfo(Guid.Parse(SaveId));
                if(deletedSave == null)
                {
                    response.msg = "Save does not exist";
                    return Ok(response);
                }
                response.msg = "Deletion sucesssfull";
                response.Response = _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(deletedSave);
                return Ok(deletedSave);
            }
            catch (Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }

        [HttpPost("create")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> CreateNewIDSave( [FromForm] List<IFormFile> skillImages, [FromForm] int[] imageIndex,[FromForm] IFormFile? thumbnailImage,[FromForm] IFormFile? splashArtImg,[FromForm] IFormFile? sinnerIcon)
        {
            var response = new ResponseService<SaveInfoResponseDTO<SavedIDRequestDTO>>();
            var session = (Session?) HttpContext.Items["Session"];

            if(session == null)
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }

            if(skillImages.Count>20)
            {
                response.msg = "Can only upload less or equal than 20 skill images and custom effect icon";
                return BadRequest(response);
            }

            if(imageIndex.Length!=skillImages.Count)
            {
                response.msg= "Image index and skill images don't have the same length";
                return BadRequest(response);
            }

            try
            {
                var saveIDInfo = (SavedIDInfo?) HttpContext.Items["SaveData"];
                if(saveIDInfo == null)
                {
                    response.msg = "Save data is not formatted correctly";
                    return BadRequest(response);
                }
                saveIDInfo.UserId = session.UserId;

                var newSavedInfo = await _savedInfoService.CreateSavedInfo(saveIDInfo, new SaveInfoFiles()
                {
                    skillImages = skillImages,
                    imageIndex = imageIndex,
                    thumbnailImage = thumbnailImage,
                    splashArtImg = splashArtImg,
                    sinnerIcon = sinnerIcon
                });
                if(newSavedInfo != null)
                {
                    response.Response = _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(newSavedInfo);
                    response.msg = "New save file created successfully";
                }
                else
                {
                    response.msg = "Cannot create new save";
                    response.Response = null;
                    return StatusCode(404,response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }

        [HttpPost("update")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> UpdateSave( [FromForm] List<IFormFile> skillImages, [FromForm] int[] imageIndex,[FromForm] IFormFile? thumbnailImage,[FromForm] IFormFile? splashArtImg,[FromForm] IFormFile? sinnerIcon)
        {
            var response = new ResponseService<SaveInfoResponseDTO<SavedIDRequestDTO>>();
            var session = (Session?) HttpContext.Items["Session"];
            if(session == null)
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }

            if(skillImages.Count>20)
            {
                response.msg = "Can only upload less or equal than 20 skill images and custom effect icon";
                return BadRequest(response);
            }

            if(imageIndex.Length!=skillImages.Count)
            {
                response.msg= "Image index and skill images don't have the same length";
                return BadRequest(response);
            }

            try
            {
                var saveIDInfo = (SavedIDInfo?) HttpContext.Items["SaveData"];
                if(saveIDInfo == null)
                {
                    response.msg = "Save data is not formatted correctly";
                    return BadRequest(response);
                }
                
                saveIDInfo.UserId = session.UserId;


                var updatingSave = await _savedInfoService.FindSavedInfoById(saveIDInfo.Id);
                if(updatingSave?.UserId!=session.UserId)
                {
                    response.msg = "User id does not match";
                    return BadRequest(response);
                }

                var newSavedInfo = await _savedInfoService.UpdateSavedInfo(saveIDInfo, new SaveInfoFiles()
                {
                    skillImages = skillImages,
                    imageIndex = imageIndex,
                    thumbnailImage = thumbnailImage,
                    splashArtImg = splashArtImg,
                    sinnerIcon = sinnerIcon
                });
                
                if(newSavedInfo != null)
                {
                    response.Response = _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(newSavedInfo);
                    response.msg = "Save has been updated";
                }
                else
                {
                    response.msg = "Cannot create new save";
                    response.Response = null;
                    return StatusCode(404,response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }
    }
}