using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class Test2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AllowedMaterialId",
                table: "ItemConfigs",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ItemConfigs_AllowedMaterialId",
                table: "ItemConfigs",
                column: "AllowedMaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemConfigs_MaterialsCategories_AllowedMaterialId",
                table: "ItemConfigs",
                column: "AllowedMaterialId",
                principalTable: "MaterialsCategories",
                principalColumn: "MaterialsCategoriesId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemConfigs_MaterialsCategories_AllowedMaterialId",
                table: "ItemConfigs");

            migrationBuilder.DropIndex(
                name: "IX_ItemConfigs_AllowedMaterialId",
                table: "ItemConfigs");

            migrationBuilder.DropColumn(
                name: "AllowedMaterialId",
                table: "ItemConfigs");
        }
    }
}
