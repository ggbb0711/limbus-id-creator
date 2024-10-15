using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TagName = table.Column<string>(type: "text", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tag_Post_PostId",
                        column: x => x.PostId,
                        principalTable: "Post",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropForeignKey(
            //     name: "FK_ImageObjs_Post_PostId",
            //     table: "ImageObjs");

            // migrationBuilder.DropTable(
            //     name: "Comment");

            // migrationBuilder.DropTable(
            //     name: "CustomEffect");

            // migrationBuilder.DropTable(
            //     name: "DefenseSkill");

            // migrationBuilder.DropTable(
            //     name: "MentalEffect");

            // migrationBuilder.DropTable(
            //     name: "OffenseSkill");

            // migrationBuilder.DropTable(
            //     name: "PassiveSkill");

            // migrationBuilder.DropTable(
            //     name: "PostView");

            // migrationBuilder.DropTable(
            //     name: "Session");

            // migrationBuilder.DropTable(
            //     name: "Tag");

            // migrationBuilder.DropTable(
            //     name: "SavedSkill");

            // migrationBuilder.DropTable(
            //     name: "SavedEgo");

            // migrationBuilder.DropTable(
            //     name: "SavedId");

            // migrationBuilder.DropTable(
            //     name: "SavedEGOInfos");

            // migrationBuilder.DropTable(
            //     name: "SavedIDInfos");

            // migrationBuilder.DropTable(
            //     name: "Post");

            // migrationBuilder.DropTable(
            //     name: "Users");

            // migrationBuilder.DropTable(
            //     name: "ImageObjs");
        }
    }
}
