import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";
import { useQuest } from "../Contexts/QuestContext";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory, removeItemFromInventory, getItemAmount } = useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem } = useRandomItems();
  const { activeQuest, startQuest, finishQuest } = useQuest();

  const handleQuest = (interaction: InteractionMapDTO) => {
    const quest = interaction.quest;

    if (quest.type === "pickup_item") {
      if (!quest.rewardItemId) return false;

      const activeAsset = assets.find(a => a.assetId === quest.rewardItemId);
      
      const item: AssetInventory = {
        assetId: quest.rewardItemId,
        name: activeAsset?.name || "Unknown Item",
        imageUrl: activeAsset?.imageUrl || "/images/game_assets/placeholder-image.svg",
      };

      console.log("Přidávám do inventáře položku:", item);

      const success = addItemToInventory(item, quest.rewardAmount ?? 1);
      if (success) {
        if (interaction.interactionId < 0) {
            despawnItem(interaction.locationX, interaction.locationY);
        }
      }

      return success;
    }
    else if (quest.type === "add_to_balance") {
      const random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      addToBalance(random);

      if (interaction.interactionId < 0) {
          despawnItem(interaction.locationX, interaction.locationY);
      }

      // return quest

      if (!activeQuest) {
        startQuest(quest);
        return;
      }

      if (
        activeQuest.type === "RETURN" &&
        quest.id === activeQuest.id
      ) {
        const amount = getItemAmount(activeQuest.requiredItemId);
  
        if (amount < activeQuest.requiredAmount) {
          console.log("Nemáš dost itemů");
          return;
        }
  
        removeItemFromInventory(
          activeQuest.requiredItemId,
          activeQuest.requiredAmount
        );
  
        addToBalance(activeQuest.rewardMoney);
        finishQuest();
        return;
      }
      console.log("Tenhle quest teď není aktivní");

      return true;
    }

    console.warn("Unknown quest type:", quest.type);
    return false;
  };

  return { handleQuest };
};
