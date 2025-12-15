using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiny_haven.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixQuestsInDbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests");

            migrationBuilder.AddForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests",
                column: "NextQuestId",
                principalTable: "Quests",
                principalColumn: "QuestId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests");

            migrationBuilder.AddForeignKey(
                name: "FK_Quests_Quests_NextQuestId",
                table: "Quests",
                column: "NextQuestId",
                principalTable: "Quests",
                principalColumn: "QuestId");
        }
    }
}
