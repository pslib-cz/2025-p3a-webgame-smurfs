import { createContext, use, useContext, useState } from "react";
import type { QuestDTO } from "../Types/database-types";
import { questsPromise } from "../api/gameResources";

type QuestContextType = {
  activeQuest: QuestDTO | null;
  completedQuestIds: number[];

  startQuest: (quest: QuestDTO) => void;
  finishQuest: () => void;
};

const QuestContext = createContext<QuestContextType | null>(null);

export const QuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeQuest, setActiveQuest] = useState<QuestDTO | null>(null);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);

  const questData = use(questsPromise);
  let nextQuest = null;

  const startQuest = (quest: QuestDTO) => {
    if (activeQuest) return; // jen jeden quest
    setActiveQuest(quest);
    return;
  };

  const finishQuest = () => {
    if (!activeQuest) return;

    setCompletedQuestIds(prev => [...prev, activeQuest.questId]);

    if (activeQuest?.nextQuestId) {
      nextQuest = questData.find((q: QuestDTO) => q.questId === activeQuest?.nextQuestId);
      setActiveQuest(nextQuest)
    } else (
      setActiveQuest(null)
    )
  };

  return (
    <QuestContext.Provider
      value={{ activeQuest, completedQuestIds, startQuest, finishQuest }}
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
