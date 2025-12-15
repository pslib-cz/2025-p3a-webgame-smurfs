using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class TestPlaceholderImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "InteractionTypes",
                columns: table => new
                {
                    InteractionTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InteractionTypes", x => x.InteractionTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    SpanX = table.Column<int>(type: "INTEGER", nullable: false),
                    SpanY = table.Column<int>(type: "INTEGER", nullable: false),
                    Collision = table.Column<bool>(type: "INTEGER", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.AssetId);
                    table.ForeignKey(
                        name: "FK_Assets_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocationMaps",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationMaps", x => x.LocationId);
                    table.ForeignKey(
                        name: "FK_LocationMaps_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "AssetId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Quests",
                columns: table => new
                {
                    QuestId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ItemQuantity = table.Column<int>(type: "INTEGER", nullable: false),
                    RewardAmount = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false),
                    NextQuestId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quests", x => x.QuestId);
                    table.ForeignKey(
                        name: "FK_Quests_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "AssetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Quests_Quests_NextQuestId",
                        column: x => x.NextQuestId,
                        principalTable: "Quests",
                        principalColumn: "QuestId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "InteractionMaps",
                columns: table => new
                {
                    InteractionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    xOffsetStart = table.Column<int>(type: "INTEGER", nullable: false),
                    xOffsetEnd = table.Column<int>(type: "INTEGER", nullable: false),
                    yOffsetStart = table.Column<int>(type: "INTEGER", nullable: false),
                    yOffsetEnd = table.Column<int>(type: "INTEGER", nullable: false),
                    InteractionTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InteractionMaps", x => x.InteractionId);
                    table.ForeignKey(
                        name: "FK_InteractionMaps_InteractionTypes_InteractionTypeId",
                        column: x => x.InteractionTypeId,
                        principalTable: "InteractionTypes",
                        principalColumn: "InteractionTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InteractionMaps_LocationMaps_LocationId",
                        column: x => x.LocationId,
                        principalTable: "LocationMaps",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InteractionMaps_Quests_QuestId",
                        column: x => x.QuestId,
                        principalTable: "Quests",
                        principalColumn: "QuestId");
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "Name" },
                values: new object[] { 1, "Nature" });

            migrationBuilder.InsertData(
                table: "Assets",
                columns: new[] { "AssetId", "CategoryId", "Collision", "ImageUrl", "Name", "SpanX", "SpanY" },
                values: new object[,]
                {
                    { 1, 1, true, null, "Wooden_Crate", 1, 1 },
                    { 2, 1, true, null, "Labubu", 1, 1 },
                    { 3, 1, false, "images/bush_smurfberries.svg", "bush_smurfberries", 1, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CategoryId",
                table: "Assets",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InteractionMaps_InteractionTypeId",
                table: "InteractionMaps",
                column: "InteractionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InteractionMaps_LocationId",
                table: "InteractionMaps",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_InteractionMaps_QuestId",
                table: "InteractionMaps",
                column: "QuestId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationMaps_AssetId",
                table: "LocationMaps",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_Quests_AssetId",
                table: "Quests",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_Quests_NextQuestId",
                table: "Quests",
                column: "NextQuestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InteractionMaps");

            migrationBuilder.DropTable(
                name: "InteractionTypes");

            migrationBuilder.DropTable(
                name: "LocationMaps");

            migrationBuilder.DropTable(
                name: "Quests");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
