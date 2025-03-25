using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RepositoryLayer.Migrations
{
    /// <inheritdoc />
    public partial class CreateInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PostView",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostView", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomEffect",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImageAttachId = table.Column<Guid>(type: "uuid", nullable: false),
                    EffectColor = table.Column<string>(type: "text", nullable: false),
                    Effect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomEffect", x => new { x.Id, x.SavedSkillId });
                });

            migrationBuilder.CreateTable(
                name: "DefenseSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
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
                    ImageAttachId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefenseSkill", x => new { x.Id, x.SavedSkillId });
                });

            migrationBuilder.CreateTable(
                name: "ImageObjs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageObjs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserEmail = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    UserIconId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_ImageObjs_UserIconId",
                        column: x => x.UserIconId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Post",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ViewCount = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Post", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Post_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedEGOInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SaveTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ImageAttachId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedEgoKey = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedEGOInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedEGOInfos_ImageObjs_ImageAttachId",
                        column: x => x.ImageAttachId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedEGOInfos_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedIDInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SaveTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ImageAttachId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedIdKey = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedIDInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedIDInfos_ImageObjs_ImageAttachId",
                        column: x => x.ImageAttachId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedIDInfos_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Session",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Expired = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Session", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Session_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "SavedEgo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SanityCost = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtId = table.Column<Guid>(type: "uuid", nullable: false),
                    SplashArtScale = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtTranslationX = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtTranslationY = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantWrath = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantLust = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantSloth = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantGluttony = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantGloom = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantPride = table.Column<double>(type: "double precision", nullable: false),
                    SinResistantEnvy = table.Column<double>(type: "double precision", nullable: false),
                    SinCostWrath = table.Column<double>(type: "double precision", nullable: false),
                    SinCostLust = table.Column<double>(type: "double precision", nullable: false),
                    SinCostSloth = table.Column<double>(type: "double precision", nullable: false),
                    SinCostGluttony = table.Column<double>(type: "double precision", nullable: false),
                    SinCostGloom = table.Column<double>(type: "double precision", nullable: false),
                    SinCostPride = table.Column<double>(type: "double precision", nullable: false),
                    SinCostEnvy = table.Column<double>(type: "double precision", nullable: false),
                    SinnerColor = table.Column<string>(type: "text", nullable: false),
                    SinnerIconId = table.Column<Guid>(type: "uuid", nullable: false),
                    EgoLevel = table.Column<string>(type: "text", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedEgo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedEgo_ImageObjs_SinnerIconId",
                        column: x => x.SinnerIconId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedEgo_ImageObjs_SplashArtId",
                        column: x => x.SplashArtId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedEgo_SavedEGOInfos_Id",
                        column: x => x.Id,
                        principalTable: "SavedEGOInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedId",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SplashArtId = table.Column<Guid>(type: "uuid", nullable: false),
                    SplashArtScale = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtTranslationX = table.Column<double>(type: "double precision", nullable: false),
                    SplashArtTranslationY = table.Column<double>(type: "double precision", nullable: false),
                    HP = table.Column<double>(type: "double precision", nullable: false),
                    MinSpeed = table.Column<double>(type: "double precision", nullable: false),
                    MaxSpeed = table.Column<double>(type: "double precision", nullable: false),
                    StaggerResist = table.Column<string>(type: "text", nullable: false),
                    DefenseLevel = table.Column<double>(type: "double precision", nullable: false),
                    SinnerColor = table.Column<string>(type: "text", nullable: false),
                    SinnerIconId = table.Column<Guid>(type: "uuid", nullable: false),
                    SlashResistant = table.Column<double>(type: "double precision", nullable: false),
                    PierceResistant = table.Column<double>(type: "double precision", nullable: false),
                    BluntResistant = table.Column<double>(type: "double precision", nullable: false),
                    Rarity = table.Column<string>(type: "text", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedId", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedId_ImageObjs_SinnerIconId",
                        column: x => x.SinnerIconId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedId_ImageObjs_SplashArtId",
                        column: x => x.SplashArtId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedId_SavedIDInfos_Id",
                        column: x => x.Id,
                        principalTable: "SavedIDInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FK_SavedEgo_SavedSkill_key = table.Column<Guid>(type: "uuid", nullable: true),
                    FK_SavedId_SavedSkill_key = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedSkill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedSkill_SavedEgo_FK_SavedEgo_SavedSkill_key",
                        column: x => x.FK_SavedEgo_SavedSkill_key,
                        principalTable: "SavedEgo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedSkill_SavedId_FK_SavedId_SavedSkill_key",
                        column: x => x.FK_SavedId_SavedSkill_key,
                        principalTable: "SavedId",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentalEffect",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    Effect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentalEffect", x => new { x.Id, x.SavedSkillId });
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
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SkillLevel = table.Column<int>(type: "integer", nullable: false),
                    SkillAmt = table.Column<int>(type: "integer", nullable: false),
                    AtkWeight = table.Column<int>(type: "integer", nullable: false),
                    DamageType = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkillAffinity = table.Column<string>(type: "text", nullable: false),
                    BasePower = table.Column<int>(type: "integer", nullable: false),
                    CoinNo = table.Column<int>(type: "integer", nullable: false),
                    CoinPow = table.Column<int>(type: "integer", nullable: false),
                    ImageAttachId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OffenseSkill", x => new { x.Id, x.SavedSkillId });
                    table.ForeignKey(
                        name: "FK_OffenseSkill_ImageObjs_ImageAttachId",
                        column: x => x.ImageAttachId,
                        principalTable: "ImageObjs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OffenseSkill_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PassiveSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SavedSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false),
                    SkillLabel = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkillEffect = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Affinity = table.Column<string>(type: "text", nullable: false),
                    Req = table.Column<string>(type: "text", nullable: false),
                    ReqNo = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassiveSkill", x => new { x.Id, x.SavedSkillId });
                    table.ForeignKey(
                        name: "FK_PassiveSkill_SavedSkill_SavedSkillId",
                        column: x => x.SavedSkillId,
                        principalTable: "SavedSkill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_PostId",
                table: "Comment",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_UserId",
                table: "Comment",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomEffect_Id",
                table: "CustomEffect",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_CustomEffect_ImageAttachId",
                table: "CustomEffect",
                column: "ImageAttachId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomEffect_SavedSkillId",
                table: "CustomEffect",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_DefenseSkill_Id",
                table: "DefenseSkill",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_DefenseSkill_ImageAttachId",
                table: "DefenseSkill",
                column: "ImageAttachId");

            migrationBuilder.CreateIndex(
                name: "IX_DefenseSkill_SavedSkillId",
                table: "DefenseSkill",
                column: "SavedSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageObjs_PostId",
                table: "ImageObjs",
                column: "PostId");

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
                name: "IX_OffenseSkill_ImageAttachId",
                table: "OffenseSkill",
                column: "ImageAttachId");

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
                name: "IX_Post_UserId",
                table: "Post",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEGOInfos_Id",
                table: "SavedEGOInfos",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEGOInfos_ImageAttachId",
                table: "SavedEGOInfos",
                column: "ImageAttachId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEGOInfos_UserId",
                table: "SavedEGOInfos",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEgo_SinnerIconId",
                table: "SavedEgo",
                column: "SinnerIconId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedEgo_SplashArtId",
                table: "SavedEgo",
                column: "SplashArtId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedIDInfos_Id",
                table: "SavedIDInfos",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SavedIDInfos_ImageAttachId",
                table: "SavedIDInfos",
                column: "ImageAttachId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedIDInfos_UserId",
                table: "SavedIDInfos",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedId_SinnerIconId",
                table: "SavedId",
                column: "SinnerIconId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedId_SplashArtId",
                table: "SavedId",
                column: "SplashArtId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedSkill_FK_SavedEgo_SavedSkill_key",
                table: "SavedSkill",
                column: "FK_SavedEgo_SavedSkill_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SavedSkill_FK_SavedId_SavedSkill_key",
                table: "SavedSkill",
                column: "FK_SavedId_SavedSkill_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Session_UserId",
                table: "Session",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_PostId",
                table: "Tag",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Id",
                table: "Users",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserIconId",
                table: "Users",
                column: "UserIconId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Post_PostId",
                table: "Comment",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Users_UserId",
                table: "Comment",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomEffect_ImageObjs_ImageAttachId",
                table: "CustomEffect",
                column: "ImageAttachId",
                principalTable: "ImageObjs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomEffect_SavedSkill_SavedSkillId",
                table: "CustomEffect",
                column: "SavedSkillId",
                principalTable: "SavedSkill",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DefenseSkill_ImageObjs_ImageAttachId",
                table: "DefenseSkill",
                column: "ImageAttachId",
                principalTable: "ImageObjs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DefenseSkill_SavedSkill_SavedSkillId",
                table: "DefenseSkill",
                column: "SavedSkillId",
                principalTable: "SavedSkill",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageObjs_Post_PostId",
                table: "ImageObjs",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImageObjs_Post_PostId",
                table: "ImageObjs");

            migrationBuilder.DropTable(
                name: "Comment");

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
                name: "PostView");

            migrationBuilder.DropTable(
                name: "Session");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropTable(
                name: "SavedSkill");

            migrationBuilder.DropTable(
                name: "SavedEgo");

            migrationBuilder.DropTable(
                name: "SavedId");

            migrationBuilder.DropTable(
                name: "SavedEGOInfos");

            migrationBuilder.DropTable(
                name: "SavedIDInfos");

            migrationBuilder.DropTable(
                name: "Post");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "ImageObjs");
        }
    }
}
