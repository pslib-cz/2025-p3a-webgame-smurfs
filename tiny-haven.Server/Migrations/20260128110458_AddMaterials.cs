using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMaterials : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemConfig_Assets_AssetId",
                table: "ItemConfig");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItemConfig",
                table: "ItemConfig");

            migrationBuilder.RenameTable(
                name: "ItemConfig",
                newName: "ItemConfigs");

            migrationBuilder.RenameIndex(
                name: "IX_ItemConfig_AssetId",
                table: "ItemConfigs",
                newName: "IX_ItemConfigs_AssetId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItemConfigs",
                table: "ItemConfigs",
                column: "ItemConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemConfigs_Assets_AssetId",
                table: "ItemConfigs",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "AssetId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemConfigs_Assets_AssetId",
                table: "ItemConfigs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItemConfigs",
                table: "ItemConfigs");

            migrationBuilder.RenameTable(
                name: "ItemConfigs",
                newName: "ItemConfig");

            migrationBuilder.RenameIndex(
                name: "IX_ItemConfigs_AssetId",
                table: "ItemConfig",
                newName: "IX_ItemConfig_AssetId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItemConfig",
                table: "ItemConfig",
                column: "ItemConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemConfig_Assets_AssetId",
                table: "ItemConfig",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "AssetId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
