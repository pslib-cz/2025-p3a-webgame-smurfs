import { useRef, use } from "react";
import { useInventory } from "../Contexts/InventoryContext";
import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useRandomItems } from "../Contexts/RandomItemsContext";
import type { AssetDTO, InteractionMapDTO, QuestDTO } from "../Types/database-types";
import type { AssetInventory } from "../Types/player-data";
import { useQuest } from "../Contexts/QuestContext";
import { useEffect } from "react";
import { questsPromise } from "../api/gameResources";

export const useQuestActions = (assets: AssetDTO[]) => {
  const { addItemToInventory, removeItemFromInventory, getItemAmount } = useInventory();
  const { addToBalance } = usePlayerBalance();
  const { despawnItem, generatedItems, spawnItems, requestAllItems } = useRandomItems();
  const { activeQuest, queueQuestStart, finishQuest, isQuestCompleted, questStartLocation } = useQuest();
  const pickupCount = useRef(0);
  
  const questData = use(questsPromise);

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

  useEffect(() => {
    if (!activeQuest) return;
  
    if (
      activeQuest.type === "quest_start" &&
      activeQuest.wantedItemId &&
      activeQuest.itemQuantity
    ) {
      const wantedId = activeQuest.wantedItemId;
      const requiredAmount = activeQuest.itemQuantity;
  
      const currentOnMap = generatedItems.filter(
        item => item.assetId === wantedId
      ).length;
  
      if (currentOnMap < requiredAmount) {
        console.log(`Quest start: na mapě je ${currentOnMap} /${requiredAmount}, generuji…`);
        spawnItems(wantedId);
      }
    }
  }, [activeQuest, generatedItems, spawnItems]);

  
  useEffect(() => {
    if (!activeQuest) return;

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
    
    if (!isQuestCompleted(quest.questId) && quest.type === "quest_start" && activeQuest?.type === "quest_start") {
      return "inProcess";
    }
    
    if (!activeQuest && quest.type === "quest_start") {
      queueQuestStart(quest, interaction.locationX, interaction.locationY);
      return { type: "startQuestMsg", description: quest.description };
    }

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
        checkBackgroundRegeneration();
      }

      return success;
    }
    
    if (quest.type === "add_to_balance") {
      const random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      addToBalance(random);

      if (interaction.interactionId < 0) {
        despawnItem(interaction.locationX, interaction.locationY);
        checkBackgroundRegeneration();
      }
    }

    // ---------- QUEST END ----------
    if (activeQuest && activeQuest.type === "quest_end") {
      if (
        !questStartLocation ||
        questStartLocation.x !== interaction.locationX ||
        questStartLocation.y !== interaction.locationY
      ) {
        return false;
      }

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
            imageUrl: asset?.imageUrl || "/images/game_assets/placeholder-image.svg"
          };
          addItemToInventory(item, rewardAmount);
        }

        // Najdi další quest_start se stejným wantedItemId
        const nextQuestStart = questData.find(
          (q: QuestDTO) => 
            q.type === "quest_start" && 
            q.wantedItemId === activeQuest.wantedItemId &&
            q.questId > activeQuest.questId
        );

        finishQuest(
          nextQuestStart?.questId, 
          interaction.locationX, 
          interaction.locationY
        );
        
        return { type: "endQuestMsg", description: endDescription };
      }

      return false;
    }

    return true; 
  };

  return { handleQuest };  
};