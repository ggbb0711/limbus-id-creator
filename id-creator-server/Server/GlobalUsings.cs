// These aliases exist because the Post/User/Comment entity classes share their exact
// name with their owning feature's namespace segment (Server.Features.Post, .User, .Comment).
// C# resolves an unqualified "Post"/"User"/"Comment" to that sibling namespace before it
// ever consults a `using ...Model;` import, so any reference to these entities from a
// namespace nested under Server.Features must go through these aliases instead of the bare
// type name. Files under Server.Shared.* don't need them since Shared is a sibling of
// Features, not nested inside it, so no such collision exists there.
global using PostModel = Server.Shared.Model.Post;
global using UserModel = Server.Shared.Model.User;
global using CommentModel = Server.Shared.Model.Comment;
