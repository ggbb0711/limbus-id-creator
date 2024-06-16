using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SavedInfoId",
                table: "Comment",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SavedEgo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SanityCost = table.Column<int>(type: "integer", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    SplashArtScale = table.Column<int>(type: "integer", nullable: false),
                    SplashArtTranslationX = table.Column<int>(type: "integer", nullable: false),
                    SplashArtTranslationY = table.Column<int>(type: "integer", nullable: false),
                    SinResistantWrath = table.Column<int>(type: "integer", nullable: false),
                    SinResistantLust = table.Column<int>(type: "integer", nullable: false),
                    SinResistantSloth = table.Column<int>(type: "integer", nullable: false),
                    SinResistantGluttony = table.Column<int>(type: "integer", nullable: false),
                    SinResistantGloom = table.Column<int>(type: "integer", nullable: false),
                    SinResistantPride = table.Column<int>(type: "integer", nullable: false),
                    SinResistantEnvy = table.Column<int>(type: "integer", nullable: false),
                    SinCostWrath = table.Column<int>(type: "integer", nullable: false),
                    SinCostLust = table.Column<int>(type: "integer", nullable: false),
                    SinCostSloth = table.Column<int>(type: "integer", nullable: false),
                    SinCostGluttony = table.Column<int>(type: "integer", nullable: false),
                    SinCostGloom = table.Column<int>(type: "integer", nullable: false),
                    SinCostPride = table.Column<int>(type: "integer", nullable: false),
                    SinCostEnvy = table.Column<int>(type: "integer", nullable: false),
                    sinnerColor = table.Column<string>(type: "text", nullable: false),
                    SinnerIcon = table.Column<string>(type: "text", nullable: false),
                    EgoLevel = table.Column<string>(type: "text", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedEgo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SavedId",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    SplashArtScale = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtTranslationX = table.Column<int>(type: "integer", nullable: false),
                    SplashArtTranslationY = table.Column<int>(type: "integer", nullable: false),
                    HP = table.Column<int>(type: "integer", nullable: false),
                    MinSpeed = table.Column<int>(type: "integer", nullable: false),
                    MaxSpeed = table.Column<int>(type: "integer", nullable: false),
                    StaggerResist = table.Column<string>(type: "text", nullable: false),
                    DefenseLevel = table.Column<int>(type: "integer", nullable: false),
                    SinnerColor = table.Column<string>(type: "text", nullable: false),
                    SinnerIcon = table.Column<string>(type: "text", nullable: false),
                    SlashResistant = table.Column<int>(type: "integer", nullable: false),
                    PierceResistant = table.Column<int>(type: "integer", nullable: false),
                    BluntResistant = table.Column<int>(type: "integer", nullable: false),
                    Rarity = table.Column<string>(type: "text", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedId", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SavedInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SaveTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SaveIdKey = table.Column<Guid>(type: "uuid", nullable: true),
                    SaveEgoKey = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedInfos_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedSkill", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TagName = table.Column<string>(type: "text", nullable: false),
                    TagImg = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SaveInfoId = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedInfoId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reaction_SavedInfos_SavedInfoId",
                        column: x => x.SavedInfoId,
                        principalTable: "SavedInfos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CustomEffect",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    EffectColor = table.Column<string>(type: "text", nullable: false),
                    Effect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomEffect", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomEffect_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DefenseSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillLevel = table.Column<int>(type: "integer", nullable: false),
                    SkillAmt = table.Column<int>(type: "integer", nullable: false),
                    AtkWeight = table.Column<int>(type: "integer", nullable: false),
                    DefenseType = table.Column<string>(type: "text", nullable: false),
                    DamageType = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkillAffinity = table.Column<string>(type: "text", nullable: false),
                    BasePower = table.Column<int>(type: "integer", nullable: false),
                    CoinNo = table.Column<int>(type: "integer", nullable: false),
                    CoinPow = table.Column<int>(type: "integer", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefenseSkill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefenseSkill_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentalEffect",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Effect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentalEffect", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentalEffect_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OffenseSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SaveSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillLevel = table.Column<int>(type: "integer", nullable: false),
                    SkillAmt = table.Column<int>(type: "integer", nullable: false),
                    AtkWeight = table.Column<int>(type: "integer", nullable: false),
                    DamageType = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkillAffinity = table.Column<string>(type: "text", nullable: false),
                    BasePower = table.Column<int>(type: "integer", nullable: false),
                    CoinNo = table.Column<int>(type: "integer", nullable: false),
                    CoinPow = table.Column<int>(type: "integer", nullable: false),
                    ImageAttach = table.Column<string>(type: "text", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OffenseSkill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OffenseSkill_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PassiveSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SaveSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Affinity = table.Column<string>(type: "text", nullable: false),
                    Req = table.Column<string>(type: "text", nullable: false),
                    ReqNo = table.Column<int>(type: "integer", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassiveSkill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PassiveSkill_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SavedInfoTag",
                columns: table => new
                {
                    SavedInfosId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedInfoTag", x => new { x.SavedInfosId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_SavedInfoTag_SavedInfos_SavedInfosId",
                        column: x => x.SavedInfosId,
                        principalTable: "SavedInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedInfoTag_Tag_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_SavedInfoId",
                table: "Comment",
                column: "SavedInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomEffect_Id",
                table: "CustomEffect",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_CustomEffect_SavedSkillId",
                table: "CustomEffect",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_DefenseSkill_Id",
                table: "DefenseSkill",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_DefenseSkill_SavedSkillId",
                table: "DefenseSkill",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_MentalEffect_Id",
                table: "MentalEffect",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MentalEffect_SavedSkillId",
                table: "MentalEffect",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_OffenseSkill_Id",
                table: "OffenseSkill",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_OffenseSkill_SavedSkillId",
                table: "OffenseSkill",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_PassiveSkill_Id",
                table: "PassiveSkill",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PassiveSkill_SavedSkillId",
                table: "PassiveSkill",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_SavedInfoId",
                table: "Reaction",
                column: "SavedInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_UserId_SaveInfoId",
                table: "Reaction",
                columns: new[] { "UserId", "SaveInfoId" });

            migrationBuilder.CreateIndex(
                name: "IX_SavedInfoTag_TagsId",
                table: "SavedInfoTag",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedInfos_Id",
                table: "SavedInfos",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SavedInfos_UserId",
                table: "SavedInfos",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_SavedInfos_SavedInfoId",
                table: "Comment",
                column: "SavedInfoId",
                principalTable: "SavedInfos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_SavedInfos_SavedInfoId",
                table: "Comment");

            migrationBuilder.DropTable(
                name: "CustomEffect");

            migrationBuilder.DropTable(
                name: "DefenseSkill");

            migrationBuilder.DropTable(
                name: "MentalEffect");

            migrationBuilder.DropTable(
                name: "OffenseSkill");

            migrationBuilder.DropTable(
                name: "PassiveSkill");

            migrationBuilder.DropTable(
                name: "Reaction");

            migrationBuilder.DropTable(
                name: "SavedEgo");

            migrationBuilder.DropTable(
                name: "SavedId");

            migrationBuilder.DropTable(
                name: "SavedInfoTag");

            migrationBuilder.DropTable(
                name: "SavedSkill");

            migrationBuilder.DropTable(
                name: "SavedInfos");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_Comment_SavedInfoId",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "SavedInfoId",
                table: "Comment");
        }
    }
}
