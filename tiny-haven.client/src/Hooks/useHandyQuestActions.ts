import { usePlayerBalance } from "../Contexts/PlayerBalanceContext";
import { useQuest } from "../Contexts/QuestContext";
import { use, useEffect } from "react";
import { questsPromise } from "../api/gameResources";
import type { QuestDTO } from "../Types/database-types";

export const useHandyQuestActions = () => {
  const { handyQuest, startHandyQuest, finishHandyQuest, progressHandyQuest, isQuestCompleted } = useQuest();
  const { balance, addToBalance, subtractFromBalance } = usePlayerBalance();
  const quests = use(questsPromise);

  useEffect(() => {
    if (!handyQuest) return;
    
    if (handyQuest.type === "quest_handy_smurf") {
      const requiredAmount = handyQuest.itemQuantity ?? 0;
      
      if (balance >= requiredAmount) {
        const nextQuestId = handyQuest.nextQuestId;
        if (nextQuestId) {
          const nextQuest = quests.find((q: QuestDTO) => q.questId === nextQuestId);
          if (nextQuest) {
            progressHandyQuest(nextQuest);
          }
        }
      }
    }
  }, [handyQuest, balance, quests, progressHandyQuest]);

  const handleHandyQuestInteraction = (quest: any) => {
    if (!handyQuest) {
      if (quest.type === "quest_handy_smurf") {
        const rootQuestId = quest.questId;
        if (isQuestCompleted(rootQuestId)) {
          return null;
        }
        
        startHandyQuest(quest);
        return { type: "start", description: quest.description };
      }
      return null;
    }

    // -------- HANDY QUEST 1 (SBĚR BOBULEK) --------
    if (handyQuest.type === "quest_handy_smurf") {
      const requiredAmount = handyQuest.itemQuantity ?? 0;
      
      if (balance < requiredAmount) {
        return { type: "missingItems" };
      }
      
      return { type: "alreadyProgressed" };
    }

    // -------- HANDY QUEST 2 (ODEVZDÁNÍ BOBULEK) --------
    if (handyQuest.type === "quest_handy_smurf_2") {
      const requiredAmount = handyQuest.itemQuantity ?? 0;
      
      if (balance < requiredAmount) {
        return { type: "missingItems" };
      }

      subtractFromBalance(requiredAmount);

      addToBalance(handyQuest.rewardAmount ?? 0);

      finishHandyQuest();
      return { type: "done", description: handyQuest.description };
    }

    return null;
  };

  return { handleHandyQuestInteraction };
};