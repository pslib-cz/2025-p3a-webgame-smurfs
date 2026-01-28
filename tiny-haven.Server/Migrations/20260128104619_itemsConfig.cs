using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class itemsConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemConfig",
                columns: table => new
                {
                    ItemConfigId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GeneratingLimit = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemConfig", x => x.ItemConfigId);
                    table.ForeignKey(
                        name: "FK_ItemConfig_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "AssetId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemConfig_AssetId",
                table: "ItemConfig",
                column: "AssetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemConfig");
        }
    }
}
