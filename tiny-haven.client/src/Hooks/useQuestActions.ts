import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";
import { useQuest } from "../Contexts/QuestContext";
import { useEffect } from "react";
import { useInteractionMap } from "../Contexts/InteractionMapContext";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory, removeItemFromInventory, getItemAmount } = useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem } = useRandomItems();
  const { activeQuest, startQuest, finishQuest } = useQuest();
  const { interactions } = useInteractionMap();

  useEffect(() => {
    if (!activeQuest) return;

    if (activeQuest.type === "quest_start" && activeQuest.wantedItemId && activeQuest.itemQuantity) {
      const amount = getItemAmount(activeQuest.wantedItemId);

      if (amount >= activeQuest.itemQuantity) {
        console.log("Quest dokončen:", activeQuest.questId);
        finishQuest();

        // spustíme další quest pokud existuje
        if (activeQuest.nextQuestId) {
          const nextInteraction = interactions.find(
            i => i.quest.questId === activeQuest.nextQuestId
          );
          if (nextInteraction) {
            startQuest(nextInteraction.quest);
            console.log("Spuštěn další quest:", nextInteraction.quest.name);
          }
        }
      }
    }

    if (activeQuest.type === "quest_end" && activeQuest.wantedItemId && activeQuest.itemQuantity) {
      const amount = getItemAmount(activeQuest.wantedItemId);

      if (amount >= activeQuest.itemQuantity) {
        removeItemFromInventory(activeQuest.wantedItemId, activeQuest.itemQuantity);
        finishQuest();
        console.log("Quest end dokončen:", activeQuest.questId);
      }
    }

  }, [activeQuest, getItemAmount, finishQuest, startQuest, interactions]);


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
      if (success && interaction.interactionId < 0) {
        despawnItem(interaction.locationX, interaction.locationY);
      }

      return success;
    } 
    else if (quest.type === "add_to_balance") {
      const random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      addToBalance(random);
    }

    
    if (!activeQuest) {
      startQuest(quest);
      return;
    }

    return true;
  };

  return { handleQuest };
};
