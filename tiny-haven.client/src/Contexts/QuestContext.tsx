import { createContext, use, useContext, useState } from "react";
import type { QuestDTO } from "../Types/database-types";
import { questsPromise } from "../api/gameResources";

type QuestContextType = {
  activeQuest: QuestDTO | null;
  completedQuestIds: number[];

  startQuest: (quest: QuestDTO) => void;
  finishQuest: () => void;
  isQuestCompleted: (questId: number) => boolean;
};

const QuestContext = createContext<QuestContextType | null>(null);

export const QuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeQuest, setActiveQuest] = useState<QuestDTO | null>(null);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);

  const questData = use(questsPromise);

  const getRootQuestId = (quest: QuestDTO): number => {
    let current = quest;
  
    while (true) {
      const prev = questData.find((q: QuestDTO) => q.nextQuestId === current.questId);
      if (!prev) return current.questId;
      current = prev;
    }
  };
  

  const startQuest = (quest: QuestDTO) => {
    if (activeQuest) return; // jen jeden quest najednou
    setActiveQuest(quest);
  };

  const finishQuest = () => {
    if (!activeQuest) return;
  
    
    if (activeQuest.nextQuestId) {
      const nextQuest = questData.find(
        (q: QuestDTO) => q.questId === activeQuest.nextQuestId
      );
      setActiveQuest(nextQuest ?? null);
      return;
    }
  
    
    const rootQuestId = getRootQuestId(activeQuest);
  
    setCompletedQuestIds(prev =>
      prev.includes(rootQuestId) ? prev : [...prev, rootQuestId]
    );
  
    setActiveQuest(null);
  };
  

  const isQuestCompleted = (questId: number) =>
  completedQuestIds.includes(questId);


  

  return (
    <QuestContext.Provider
      value={{
        activeQuest,
        completedQuestIds,
        startQuest,
        finishQuest,
        isQuestCompleted
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuest = () => {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used inside QuestProvider");
  return ctx;
};
