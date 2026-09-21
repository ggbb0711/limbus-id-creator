namespace Server.Shared.Http
{
    public class ApiResponse<ResponseType>
    {
        public bool Success { get; init; }
        public ResponseType? Data { get; init; }
        public string Message { get; init; } = "";
        public string? ErrorCode { get; init;}

        public static ApiResponse<ResponseType> Ok(ResponseType data, string message = "")
        =>
            new () { Success = true, Data = data, Message = message};
        public static ApiResponse<ResponseType> Fail(string message, string? errorCode = null)
        =>
            new () { Success = false, Message = message, ErrorCode = errorCode};
    }
}
