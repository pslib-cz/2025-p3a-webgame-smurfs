import { createContext, use, useContext, useState } from "react";
import type { QuestDTO } from "../Types/database-types";
import { questsPromise } from "../api/gameResources";

type QuestContextType = {
  activeQuest: QuestDTO | null;
  handyQuest: QuestDTO | null;

  pendingQuest: QuestDTO | null;
  completedQuestIds: number[];

  queueQuestStart: (quest: QuestDTO) => void;
  startQuest: (quest: QuestDTO) => void;

  startHandyQuest: (quest: QuestDTO) => void;
  finishHandyQuest: () => void;
  progressHandyQuest: (quest: QuestDTO) => void;

  finishQuest: () => void;
  isQuestCompleted: (questId: number) => boolean;
};

const QuestContext = createContext<QuestContextType | null>(null);

export const QuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeQuest, setActiveQuest] = useState<QuestDTO | null>(null);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  
  const [pendingQuest, setPendingQuest] = useState<QuestDTO | null>(null);
  const [handyQuest, setHandyQuest] = useState<QuestDTO | null>(null);
  
  const questData = use(questsPromise);

  const getRootQuestId = (quest: QuestDTO): number => {
    const prev = questData.find((q: QuestDTO) => q.nextQuestId === quest.questId);
    if (!prev) return quest.questId;
    return getRootQuestId(prev);
  }  

  // ......... NORMAL QUESTS ........... 
  const startQuest = (quest: QuestDTO) => {
    if (activeQuest) return; // jen jeden quest najednou
    setActiveQuest(quest);
  };

  const queueQuestStart = (quest: QuestDTO) => {
    if (activeQuest || pendingQuest) return;
  
    setPendingQuest(quest);
  
    setTimeout(() => {
      setActiveQuest(quest);
      setPendingQuest(null);
    }, 5000);
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
  }  

  // .............. HANDY QUEST ........... 

  const startHandyQuest = (quest: QuestDTO) => {
    if (handyQuest) return;
    setTimeout(() => {
      setHandyQuest(quest);
    }, 5000)
  };

  const progressHandyQuest = (nextQuest: QuestDTO) => {
    setHandyQuest(nextQuest);
  };

  const finishHandyQuest = () => {
    if (!handyQuest) return;
    
    const rootQuestId = getRootQuestId(handyQuest);
    setCompletedQuestIds(prev => 
      prev.includes(rootQuestId) ? prev : [...prev, rootQuestId]
    );
    
    setHandyQuest(null);
  };
    
  const isQuestCompleted = (questId: number) =>
  completedQuestIds.includes(questId);
    

  return (
    <QuestContext.Provider
      value={{
        activeQuest,
        pendingQuest,
        handyQuest,
        completedQuestIds,

        queueQuestStart,
        startQuest,
        startHandyQuest,
        progressHandyQuest,
        finishQuest,
        finishHandyQuest,
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
