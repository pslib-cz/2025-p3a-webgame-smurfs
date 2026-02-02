import { useEffect } from "react";
import { useQuest } from "../Contexts/QuestContext";
import { useInventory } from "../Contexts/InventoryContext";
import { useInteractionMap } from "../Contexts/InteractionMapContext";

export const useQuestProgress = () => {
  const { activeQuest, finishQuest, startQuest } = useQuest();
  const { getItemAmount } = useInventory();
  const { interactions } = useInteractionMap();

  
};
