import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";
import { useQuest } from "../Contexts/QuestContext";
import { use, useEffect } from "react";
import { assetsPromise } from "../api/gameResources";
import { useInteractionMap } from "../Contexts/InteractionMapContext";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory, removeItemFromInventory, getItemAmount } = useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem } = useRandomItems();
  const { activeQuest, startQuest, finishQuest } = useQuest();
  const assetsData = use(assetsPromise);
  const { interactions } = useInteractionMap();

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
    }
    if (interaction.interactionId < 0) {
        despawnItem(interaction.locationX, interaction.locationY);
    }

    useEffect(() => {
      if (!activeQuest) return;

      if (activeQuest.type === "quest_start" && activeQuest.wantedItemId && activeQuest.itemQuantity) {

        const amount = getItemAmount(activeQuest.wantedItemId);

        if (amount >= activeQuest.itemQuantity) {
          finishQuest();

          // Spuštění next questu (quest_end)
          if (activeQuest.nextQuestId) {
            const nextInteraction = interactions.find(
              i => i.quest.questId === activeQuest.nextQuestId
            );

          if (nextInteraction) {
            startQuest(nextInteraction.quest);
          }
        }
      }
    } [activeQuest, getItemAmount]})


    // return quest

    if (!activeQuest) {
      startQuest(quest);
      return;
    }

    if (
      activeQuest.type === "quest_end" &&
      quest.questId === activeQuest.questId &&
      activeQuest.wantedItemId &&
      activeQuest.itemQuantity
    ) {
      const amount = getItemAmount(activeQuest.wantedItemId);

      if (amount < activeQuest.itemQuantity) {
        console.log("Nemáš dost itemů");
        return;
      }

      removeItemFromInventory(
        activeQuest.wantedItemId,
        activeQuest.itemQuantity
      );

      const rawAsset = assetsData.find((a: AssetDTO) => a.assetId === activeQuest.rewardItemId);
      const asset: AssetInventory = {
        assetId: rawAsset.assetId,
        imageUrl: rawAsset.imageUrl,
        name: rawAsset.name
      }

      if (activeQuest.rewardItemId === (1 || 4)) { addToBalance(activeQuest.rewardAmount || 1); }
      else ( 
        addItemToInventory((asset), activeQuest.rewardAmount || 1)
      )

      finishQuest();
      return;
    }
    console.log("Tenhle quest teď není aktivní");

    return true;
  };

  return { handleQuest };
};
