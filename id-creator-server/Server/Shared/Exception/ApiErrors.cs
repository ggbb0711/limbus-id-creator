namespace Server.Shared.Exception
{
    public sealed record ErrorInfo(string Code, string Message);

    public static class ApiErrors
    {
        private const string ContactAdmin = "If you think this is a mistake, please contact the site admin on Discord.";

        public static readonly ErrorInfo InvalidAccessToken = new("INVALID_ACCESS_TOKEN", "Invalid access token");
        public static readonly ErrorInfo InvalidRefreshToken = new("INVALID_REFRESH_TOKEN", "Missing or invalid refresh token");
        public static readonly ErrorInfo SessionExpired = new("SESSION_EXPIRED", "Session expired or revoked");
        public static readonly ErrorInfo AccountInactive = new("ACCOUNT_INACTIVE", "Account no longer exists or is inactive");
        public static readonly ErrorInfo GoogleTokenFailed = new("GOOGLE_TOKEN_FAILED", "Cannot get token from google.");

        public static readonly ErrorInfo UserNotFound = new("USER_NOT_FOUND", "User does not exist");
        public static readonly ErrorInfo NotSameUser = new("NOT_SAME_USER", "You are not logged in as this user");
        public static readonly ErrorInfo UserBanned = new("USER_BANNED", $"This account has been banned. {ContactAdmin}");

        public static readonly ErrorInfo PostNotFound = new("POST_NOT_FOUND", "Post does not exist");
        public static readonly ErrorInfo PostRemoved = new("POST_REMOVED", $"This post has been removed. {ContactAdmin}");
        public static readonly ErrorInfo PostAuthorBanned = new("POST_AUTHOR_BANNED", $"The author of this post has been banned. {ContactAdmin}");

        public static readonly ErrorInfo SaveNotFound = new("SAVE_NOT_FOUND", "Save does not exist");
        public static readonly ErrorInfo SaveUpdateFailed = new("SAVE_UPDATE_FAILED", "Cannot update save");
        public static readonly ErrorInfo ResourceNotOwned = new("RESOURCE_NOT_OWNED", "You do not own this resource.");

        public static readonly ErrorInfo ValidationFailed = new("VALIDATION_FAILED", "Validation failed");
        public static readonly ErrorInfo InternalError = new("INTERNAL_ERROR", "Something went wrong with the server");
    }
}
