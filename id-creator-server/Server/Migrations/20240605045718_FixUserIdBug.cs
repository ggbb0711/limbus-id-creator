using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class FixUserIdBug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageAttach",
                table: "SavedId",
                newName: "SplashArt");

            migrationBuilder.RenameColumn(
                name: "ImageAttach",
                table: "SavedEgo",
                newName: "SplashArt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SplashArt",
                table: "SavedId",
                newName: "ImageAttach");

            migrationBuilder.RenameColumn(
                name: "SplashArt",
                table: "SavedEgo",
                newName: "ImageAttach");
        }
    }
}
