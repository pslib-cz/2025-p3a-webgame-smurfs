import { useInventory } from "../Contexts/InventoryContext";
import type { AssetDTO, QuestDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory } = useInventory();

  const handleQuest = (quest: QuestDTO) => {
    if (quest.type === "pickup_item") {
      if (!quest.rewardItemId) return false;

      const activeAsset = assets.find(a => a.assetId === quest.rewardItemId);
      
      const item: AssetInventory = {
        assetId: quest.rewardItemId,
        name: activeAsset?.name || "Unknown Item",
        imageUrl: activeAsset?.imageUrl || "/images/game_assets/placeholder-image.svg",
      };

      console.log("Přidávám do inventáře položku:", item);

      return addItemToInventory(item, quest.rewardAmount ?? 1);
    }

    console.warn("Unknown quest type:", quest.type);
    return false;
  };

  return { handleQuest };
};
