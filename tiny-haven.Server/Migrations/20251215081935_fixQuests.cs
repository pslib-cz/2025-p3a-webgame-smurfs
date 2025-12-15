using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixQuests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Stage",
                table: "Quests",
                newName: "NextQuestId");

            migrationBuilder.RenameColumn(
                name: "ItemQuanity",
                table: "Quests",
                newName: "ItemQuantity");

            migrationBuilder.CreateIndex(
                name: "IX_Quests_NextQuestId",
                table: "Quests",
                column: "NextQuestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests",
                column: "NextQuestId",
                principalTable: "Quests",
                principalColumn: "QuestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests");

            migrationBuilder.DropIndex(
                name: "IX_Quests_NextQuestId",
                table: "Quests");

            migrationBuilder.RenameColumn(
                name: "NextQuestId",
                table: "Quests",
                newName: "Stage");

            migrationBuilder.RenameColumn(
                name: "ItemQuantity",
                table: "Quests",
                newName: "ItemQuanity");
        }
    }
}
