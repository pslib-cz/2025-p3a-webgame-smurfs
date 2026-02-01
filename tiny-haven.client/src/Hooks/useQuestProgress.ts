import { useEffect } from "react";
import { useQuest } from "../Contexts/QuestContext";
import { useInventory } from "../Contexts/InventoryContext";
import { useInteractionMap } from "../Contexts/InteractionMapContext";

export const useQuestProgress = () => {
  const { activeQuest, finishQuest, startQuest } = useQuest();
  const { getItemAmount } = useInventory();
  const { interactions } = useInteractionMap();

  useEffect(() => {
    if (!activeQuest) return;

    if (activeQuest.type !== "COLLECT") return;

    const amount = getItemAmount(activeQuest.requiredItemId);

    if (amount >= activeQuest.requiredAmount) {
      // Collect quest splněn
      finishQuest();

      // Spuštění next questu (RETURN)
      if (activeQuest.nextQuestId) {
        const nextInteraction = interactions.find(
          i => i.quest.id === activeQuest.nextQuestId
        );

        if (nextInteraction) {
          startQuest(nextInteraction.quest);
        }
      }
    }
  }, [activeQuest, getItemAmount]);
};
