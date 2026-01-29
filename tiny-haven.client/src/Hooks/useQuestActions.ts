import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useGenerateItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory } = useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem } = useGenerateItems();

  const handleQuest = (interaction: InteractionMapDTO) => {
    const { quest } = interaction;

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

      return true;
    }

    console.warn("Unknown quest type:", quest.type);
    return false;
  };

  return { handleQuest };
};
