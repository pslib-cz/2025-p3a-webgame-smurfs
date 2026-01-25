import { useInventory } from "../Contexts/InventoryContext";
import type { AssetInventory } from "../Types/player-data";

export const useQuestActions = () => {
  const { addItemToInventory } = useInventory();

  const handleQuest = (quest: Quest) => {
    if (quest.type === "pickupItem") {
      if (!quest.assetId) return false;

      const item: AssetInventory = {
        assetId: quest.assetId,
        name: quest.name,
        imageUrl: undefined, // nebo reálná URL z backendu
      };

      return addItemToInventory(item, quest.amount ?? 1);
    }

    console.warn("Unknown quest type:", quest.type);
    return false;
  };

  return { handleQuest };
};
