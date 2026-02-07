import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";
import { useQuest } from "../Contexts/QuestContext";
import { useEffect } from "react";
import { useInteractionMap } from "../Contexts/InteractionMapContext";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory, removeItemFromInventory, getItemAmount } =
    useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem, generatedItems, spawnItems } = useRandomItems();
  const { activeQuest, queueQuestStart, finishQuest, isQuestCompleted } = useQuest();
  const { interactions } = useInteractionMap();
  useEffect(() => {
    if (!activeQuest) return;
  
    if (
      activeQuest.type === "quest_start" &&
      activeQuest.wantedItemId &&
      activeQuest.itemQuantity
    ) {
      const wantedId = activeQuest.wantedItemId;
      const requiredAmount = activeQuest.itemQuantity;
  
      // kolik itemů je aktuálně na mapě
      const currentOnMap = generatedItems.filter(
        item => item.assetId === wantedId
      ).length;
  
      if (currentOnMap < requiredAmount) {
        console.log( `Quest start: na mapě je ${currentOnMap} /${requiredAmount}, generuji…`
        );
  
        spawnItems(wantedId);
      }
    }
  }, [activeQuest, generatedItems, spawnItems]);

  
  useEffect(() => {
    if (!activeQuest) return;

    // ---------- QUEST START ----------
    if (
      activeQuest.type === "quest_start" &&
      activeQuest.wantedItemId &&
      activeQuest.itemQuantity
    ) {
      
      const amount = getItemAmount(activeQuest.wantedItemId);

      if (amount >= activeQuest.itemQuantity) {
        finishQuest();
      }
    }
  }, [activeQuest, getItemAmount, finishQuest]);

    const handleQuest = (interaction: InteractionMapDTO) => {
    const quest = interaction.quest;


    if (isQuestCompleted(quest.questId) && !activeQuest) {
      return "completed";
    }
    
    if (!isQuestCompleted(quest.questId) && activeQuest?.type === "quest_start") {
      return "inProcess";
    }
    
    if (!activeQuest && quest.type === "quest_start") {
      queueQuestStart(quest);
      return { type: "startQuestMsg", description: quest.description };
    }



    // ---------- PICKUP ITEM ----------
    if (quest.type === "pickup_item") {
      if (!quest.rewardItemId) return false;

      const activeAsset = assets.find(a => a.assetId === quest.rewardItemId);

      const item: AssetInventory = {
        assetId: quest.rewardItemId,
        name: activeAsset?.name || "Unknown Item",
        imageUrl:
          activeAsset?.imageUrl ||
          "/images/game_assets/placeholder-image.svg"
      };

      const success = addItemToInventory(item, quest.rewardAmount ?? 1);

      if (success && interaction.interactionId < 0) {
        despawnItem(interaction.locationX, interaction.locationY);
      }

      return success;
    }

    // ---------- ADD TO BALANCE ----------
    if (quest.type === "add_to_balance") {
      const random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      addToBalance(random);
      return true;
    }

    // ---------- QUEST END ----------
    if (activeQuest && activeQuest.type === "quest_end") {
      const amount = getItemAmount(activeQuest.wantedItemId!);
      
      if (amount >= activeQuest.itemQuantity!) {
        const endDescription = activeQuest.description;

        removeItemFromInventory(
              activeQuest.wantedItemId!,
              activeQuest.itemQuantity!
            );

            const rewardId = activeQuest.rewardItemId;
            const rewardAmount = activeQuest.rewardAmount ?? 1;

            if (rewardId === 1 || rewardId === 4) {
              addToBalance(rewardAmount);
            } else {
              const asset = assets.find(a => a.assetId === rewardId);
              const item: AssetInventory = {
                assetId: rewardId!,
                name: asset?.name || "Unknown Item",
                imageUrl:
              asset?.imageUrl ||
              "/images/game_assets/placeholder-image.svg"
              };
              addItemToInventory(item, rewardAmount);
            }
        
        finishQuest();
        return { type: "endQuestMsg", description: endDescription };
      }

      return false;
    }

    return true; 
  };

  return { handleQuest };  
};
