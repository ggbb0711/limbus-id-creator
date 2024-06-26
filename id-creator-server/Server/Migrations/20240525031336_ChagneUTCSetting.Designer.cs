﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Server.Data;

#nullable disable

namespace Server.Migrations
{
    [DbContext(typeof(ServerDbContext))]
    [Migration("20240525031336_ChagneUTCSetting")]
    partial class ChagneUTCSetting
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("SavedInfoTag", b =>
                {
                    b.Property<Guid>("SavedInfosId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("TagsId")
                        .HasColumnType("uuid");

                    b.HasKey("SavedInfosId", "TagsId");

                    b.HasIndex("TagsId");

                    b.ToTable("SavedInfoTag");
                });

            modelBuilder.Entity("Server.Models.Comment", b =>
                {
                    b.Property<Guid>("SaveInfoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("SavedInfoId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("SaveInfoId");

                    b.HasIndex("SavedInfoId");

                    b.HasIndex("UserId");

                    b.ToTable("Comment");
                });

            modelBuilder.Entity("Server.Models.CustomEffect", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Effect")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("EffectColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Index")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("SavedSkillId");

                    b.ToTable("CustomEffect");
                });

            modelBuilder.Entity("Server.Models.DefenseSkill", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AtkWeight")
                        .HasColumnType("integer");

                    b.Property<int>("BasePower")
                        .HasColumnType("integer");

                    b.Property<int>("CoinNo")
                        .HasColumnType("integer");

                    b.Property<int>("CoinPow")
                        .HasColumnType("integer");

                    b.Property<string>("DamageType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DefenseType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Index")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("SkillAffinity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillAmt")
                        .HasColumnType("integer");

                    b.Property<string>("SkillEffect")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkillLabel")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillLevel")
                        .HasColumnType("integer");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("SavedSkillId");

                    b.ToTable("DefenseSkill");
                });

            modelBuilder.Entity("Server.Models.MentalEffect", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Effect")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Index")
                        .HasColumnType("integer");

                    b.Property<Guid>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("SavedSkillId");

                    b.ToTable("MentalEffect");
                });

            modelBuilder.Entity("Server.Models.OffenseSkill", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AtkWeight")
                        .HasColumnType("integer");

                    b.Property<int>("BasePower")
                        .HasColumnType("integer");

                    b.Property<int>("CoinNo")
                        .HasColumnType("integer");

                    b.Property<int>("CoinPow")
                        .HasColumnType("integer");

                    b.Property<string>("DamageType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Index")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("SaveSkillId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("SkillAffinity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillAmt")
                        .HasColumnType("integer");

                    b.Property<string>("SkillEffect")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkillLabel")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillLevel")
                        .HasColumnType("integer");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("SavedSkillId");

                    b.ToTable("OffenseSkill");
                });

            modelBuilder.Entity("Server.Models.PassiveSkill", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Affinity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Index")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Req")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ReqNo")
                        .HasColumnType("integer");

                    b.Property<Guid>("SaveSkillId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("SkillEffect")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkillLabel")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("SavedSkillId");

                    b.ToTable("PassiveSkill");
                });

            modelBuilder.Entity("Server.Models.Reaction", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("SaveInfoId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("SavedInfoId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<int>("Value")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SavedInfoId");

                    b.HasIndex("UserId", "SaveInfoId");

                    b.ToTable("Reaction");
                });

            modelBuilder.Entity("Server.Models.SavedEgo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("EgoLevel")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SanityCost")
                        .HasColumnType("integer");

                    b.Property<Guid>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<int>("SinCostEnvy")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostGloom")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostGluttony")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostLust")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostPride")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostSloth")
                        .HasColumnType("integer");

                    b.Property<int>("SinCostWrath")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantEnvy")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantGloom")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantGluttony")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantLust")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantPride")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantSloth")
                        .HasColumnType("integer");

                    b.Property<int>("SinResistantWrath")
                        .HasColumnType("integer");

                    b.Property<string>("SinnerIcon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SplashArtScale")
                        .HasColumnType("integer");

                    b.Property<int>("SplashArtTranslationX")
                        .HasColumnType("integer");

                    b.Property<int>("SplashArtTranslationY")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("sinnerColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("SavedEgo");
                });

            modelBuilder.Entity("Server.Models.SavedId", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("BluntResistant")
                        .HasColumnType("integer");

                    b.Property<int>("DefenseLevel")
                        .HasColumnType("integer");

                    b.Property<int>("HP")
                        .HasColumnType("integer");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("MaxSpeed")
                        .HasColumnType("integer");

                    b.Property<int>("MinSpeed")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PierceResistant")
                        .HasColumnType("integer");

                    b.Property<string>("Rarity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("SavedSkillId")
                        .HasColumnType("uuid");

                    b.Property<string>("SinnerColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SinnerIcon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SlashResistant")
                        .HasColumnType("integer");

                    b.Property<double>("SplashArtScale")
                        .HasColumnType("double precision");

                    b.Property<int>("SplashArtTranslationX")
                        .HasColumnType("integer");

                    b.Property<int>("SplashArtTranslationY")
                        .HasColumnType("integer");

                    b.Property<string>("StaggerResist")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("SavedId");
                });

            modelBuilder.Entity("Server.Models.SavedInfo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ImageAttach")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("SaveEgoKey")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("SaveIdKey")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("SaveTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.HasIndex("UserId");

                    b.ToTable("SavedInfos");
                });

            modelBuilder.Entity("Server.Models.SavedSkill", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.ToTable("SavedSkill");
                });

            modelBuilder.Entity("Server.Models.Session", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("Expired")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Session");
                });

            modelBuilder.Entity("Server.Models.Tag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("TagImg")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("TagName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Tag");
                });

            modelBuilder.Entity("Server.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserIcon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SavedInfoTag", b =>
                {
                    b.HasOne("Server.Models.SavedInfo", null)
                        .WithMany()
                        .HasForeignKey("SavedInfosId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Models.Tag", null)
                        .WithMany()
                        .HasForeignKey("TagsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Models.Comment", b =>
                {
                    b.HasOne("Server.Models.SavedInfo", null)
                        .WithMany("Comments")
                        .HasForeignKey("SavedInfoId");

                    b.HasOne("Server.Models.User", null)
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Models.CustomEffect", b =>
                {
                    b.HasOne("Server.Models.SavedSkill", null)
                        .WithMany("CustomEffects")
                        .HasForeignKey("SavedSkillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Models.DefenseSkill", b =>
                {
                    b.HasOne("Server.Models.SavedSkill", null)
                        .WithMany("DefenseSkills")
                        .HasForeignKey("SavedSkillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Models.MentalEffect", b =>
                {
                    b.HasOne("Server.Models.SavedSkill", null)
                        .WithMany("MentalEffects")
                        .HasForeignKey("SavedSkillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Models.OffenseSkill", b =>
                {
                    b.HasOne("Server.Models.SavedSkill", null)
                        .WithMany("OffenseSkills")
                        .HasForeignKey("SavedSkillId");
                });

            modelBuilder.Entity("Server.Models.PassiveSkill", b =>
                {
                    b.HasOne("Server.Models.SavedSkill", null)
                        .WithMany("PassiveSkills")
                        .HasForeignKey("SavedSkillId");
                });

            modelBuilder.Entity("Server.Models.Reaction", b =>
                {
                    b.HasOne("Server.Models.SavedInfo", null)
                        .WithMany("Reactions")
                        .HasForeignKey("SavedInfoId");
                });

            modelBuilder.Entity("Server.Models.SavedInfo", b =>
                {
                    b.HasOne("Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Server.Models.Session", b =>
                {
                    b.HasOne("Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Server.Models.SavedInfo", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Reactions");
                });

            modelBuilder.Entity("Server.Models.SavedSkill", b =>
                {
                    b.Navigation("CustomEffects");

                    b.Navigation("DefenseSkills");

                    b.Navigation("MentalEffects");

                    b.Navigation("OffenseSkills");

                    b.Navigation("PassiveSkills");
                });

            modelBuilder.Entity("Server.Models.User", b =>
                {
                    b.Navigation("Comments");
                });
#pragma warning restore 612, 618
        }
    }
}
