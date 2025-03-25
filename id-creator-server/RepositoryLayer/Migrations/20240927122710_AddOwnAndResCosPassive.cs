using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RepositoryLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnAndResCosPassive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReqOwnEnvy",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnGloom",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnGluttony",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnLust",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnPride",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnSloth",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqOwnWrath",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResEnvy",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResGloom",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResGluttony",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResLust",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResPride",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResSloth",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReqResWrath",
                table: "PassiveSkill",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReqOwnEnvy",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnGloom",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnGluttony",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnLust",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnPride",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnSloth",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqOwnWrath",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResEnvy",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResGloom",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResGluttony",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResLust",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResPride",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResSloth",
                table: "PassiveSkill");

            migrationBuilder.DropColumn(
                name: "ReqResWrath",
                table: "PassiveSkill");
        }
    }
}
