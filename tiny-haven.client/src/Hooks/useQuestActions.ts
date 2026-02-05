import { useRef } from "react";
import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory } = useInventory();
  const { addToBalance } = usePlayerBalance();
  
  const { despawnItem, requestAllItems } = useRandomItems();

  const pickupCount = useRef(0);

  const checkBackgroundRegeneration = () => {
    pickupCount.current += 1;
    console.log(`Generated items collected: ${pickupCount.current}`);

    if (pickupCount.current > 0 && pickupCount.current % 30 === 0) {
      console.log("20th item reached. Requesting new items in background...");

      if (requestAllItems) {
        requestAllItems().catch((err: unknown) => 
          console.error("Silent regeneration failed:", err)
        );
      }
    }
  };

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

      console.log("Adding item to inventory:", item);

      const success = addItemToInventory(item, quest.rewardAmount ?? 1);
      
      if (success) {
        if (interaction.interactionId < 0) {
            despawnItem(interaction.locationX, interaction.locationY);
            checkBackgroundRegeneration();
        }
      }

      return success;
    }
    
    else if (quest.type === "add_to_balance") {
      const random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      addToBalance(random);

      if (interaction.interactionId < 0) {
          despawnItem(interaction.locationX, interaction.locationY);
          checkBackgroundRegeneration();
      }

      return true;
    }

    console.warn("Unknown quest type:", quest.type);
    return false;
  };

  return { handleQuest };
};