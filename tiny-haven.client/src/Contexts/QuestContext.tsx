import { createContext, use, useContext, useState, useEffect } from "react";
import type { QuestDTO } from "../Types/database-types";
import { questsPromise } from "../api/gameResources";

const STORAGE_KEYS = {
  ACTIVE_QUEST: "rpg_active_quest_id",
  HANDY_QUEST: "rpg_handy_quest_id",
  COMPLETED_IDS: "rpg_completed_quest_ids",
  QUEST_START_LOCATION: "rpg_quest_start_location",
  QUEST_START_INTERACTION_ID: "rpg_quest_start_interaction_id",
  ACTIVE_QUEST_IDS_MAP: "rpg_active_quest_ids_map"
};

type QuestContextType = {
  activeQuest: QuestDTO | null;
  handyQuest: QuestDTO | null;
  pendingQuest: QuestDTO | null;
  completedQuestIds: number[];
  questStartLocation: { x: number; y: number } | null;
  questStartInteractionId: number | null;

  queueQuestStart: (quest: QuestDTO, locationX: number, locationY: number, interactionId: number) => void;
  startQuest: (quest: QuestDTO) => void;
  startHandyQuest: (quest: QuestDTO) => void;
  finishHandyQuest: () => void;
  progressHandyQuest: (quest: QuestDTO) => void;
  finishQuest: (nextQuestIdOverride?: number, newLocationX?: number, newLocationY?: number) => void;
  isQuestCompleted: (questId: number) => boolean;
  
  getCurrentQuestIdAtLocation: (x: number, y: number, interactionId: number) => number | null;
};

const QuestContext = createContext<QuestContextType | null>(null);

export const QuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeQuest, setActiveQuest] = useState<QuestDTO | null>(null);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const [pendingQuest, setPendingQuest] = useState<QuestDTO | null>(null);
  const [handyQuest, setHandyQuest] = useState<QuestDTO | null>(null);
  const [questStartLocation, setQuestStartLocation] = useState<{ x: number; y: number } | null>(null);
  const [questStartInteractionId, setQuestStartInteractionId] = useState<number | null>(null);
  
  const [activeQuestIdsMap, setActiveQuestIdsMap] = useState<Map<string, number>>(new Map());
  
  const questData = use(questsPromise);

  useEffect(() => {
    try {
      const storedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_IDS);
      if (storedCompleted) {
        setCompletedQuestIds(JSON.parse(storedCompleted));
      }

      const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_QUEST);
      if (storedActiveId) {
        const foundActive = questData.find((q: QuestDTO) => q.questId === Number(storedActiveId));
        if (foundActive) setActiveQuest(foundActive);
      }

      const storedHandyId = localStorage.getItem(STORAGE_KEYS.HANDY_QUEST);
      if (storedHandyId) {
        const foundHandy = questData.find((q: QuestDTO) => q.questId === Number(storedHandyId));
        if (foundHandy) setHandyQuest(foundHandy);
      }

      const storedLocation = localStorage.getItem(STORAGE_KEYS.QUEST_START_LOCATION);
      if (storedLocation) {
        setQuestStartLocation(JSON.parse(storedLocation));
      }

      const storedInteractionId = localStorage.getItem(STORAGE_KEYS.QUEST_START_INTERACTION_ID);
      if (storedInteractionId) {
        setQuestStartInteractionId(Number(storedInteractionId));
      }

      const storedQuestIdsMap = localStorage.getItem(STORAGE_KEYS.ACTIVE_QUEST_IDS_MAP);
      if (storedQuestIdsMap) {
        const mapArray = JSON.parse(storedQuestIdsMap);
        setActiveQuestIdsMap(new Map(mapArray));
      }
    } catch (error) {
      console.error("Failed to load quest progress from local storage", error);
    }
  }, [questData]);

  useEffect(() => {
    if (activeQuest) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_QUEST, activeQuest.questId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_QUEST);
    }
  }, [activeQuest]);

  useEffect(() => {
    if (handyQuest) {
      localStorage.setItem(STORAGE_KEYS.HANDY_QUEST, handyQuest.questId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.HANDY_QUEST);
    }
  }, [handyQuest]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_IDS, JSON.stringify(completedQuestIds));
  }, [completedQuestIds]);

  useEffect(() => {
    if (questStartLocation) {
      localStorage.setItem(STORAGE_KEYS.QUEST_START_LOCATION, JSON.stringify(questStartLocation));
    } else {
      localStorage.removeItem(STORAGE_KEYS.QUEST_START_LOCATION);
    }
  }, [questStartLocation]);

  useEffect(() => {
    if (questStartInteractionId !== null) {
      localStorage.setItem(STORAGE_KEYS.QUEST_START_INTERACTION_ID, questStartInteractionId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.QUEST_START_INTERACTION_ID);
    }
  }, [questStartInteractionId]);

  useEffect(() => {
    const mapArray = Array.from(activeQuestIdsMap.entries());
    localStorage.setItem(STORAGE_KEYS.ACTIVE_QUEST_IDS_MAP, JSON.stringify(mapArray));
  }, [activeQuestIdsMap]);

  const getRootQuestId = (quest: QuestDTO): number => {
    const prev = questData.find((q: QuestDTO) => q.nextQuestId === quest.questId);
    if (!prev) return quest.questId;
    return getRootQuestId(prev);
  };

  const getCurrentQuestIdAtLocation = (x: number, y: number, interactionId: number): number | null => {
    const key = `${x},${y},${interactionId}`;
    return activeQuestIdsMap.get(key) || null;
  };

  const startQuest = (quest: QuestDTO) => {
    if (activeQuest) return;
    setActiveQuest(quest);
  };

  const queueQuestStart = (quest: QuestDTO, locationX: number, locationY: number, interactionId: number) => {
    if (activeQuest || pendingQuest) return;
  
    setPendingQuest(quest);
    setQuestStartLocation({ x: locationX, y: locationY });
    setQuestStartInteractionId(interactionId);
  
    const key = `${locationX},${locationY},${interactionId}`;
    setActiveQuestIdsMap(prev => {
      const newMap = new Map(prev);
      newMap.set(key, quest.questId);
      return newMap;
    });
  
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
      
      if (questStartLocation && questStartInteractionId !== null) {
        const key = `${questStartLocation.x},${questStartLocation.y},${questStartInteractionId}`;
        setActiveQuestIdsMap(prev => {
          const newMap = new Map(prev);
          if (nextQuest) {
            newMap.set(key, nextQuest.questId);
          }
          return newMap;
        });
      }
      
      setActiveQuest(nextQuest ?? null);
      return;
    }
    
    const rootQuestId = getRootQuestId(activeQuest);
  
    setCompletedQuestIds(prev =>
      prev.includes(rootQuestId) ? prev : [...prev, rootQuestId]
    );
    
    setActiveQuest(null);
    setQuestStartLocation(null);
    setQuestStartInteractionId(null);
    
    if (questStartLocation && questStartInteractionId !== null) {
      const key = `${questStartLocation.x},${questStartLocation.y},${questStartInteractionId}`;
      setActiveQuestIdsMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    }
  };

  const startHandyQuest = (quest: QuestDTO) => {
    if (handyQuest) return;
    setTimeout(() => {
      setHandyQuest(quest);
    }, 5000);
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
        isQuestCompleted,
        questStartLocation,
        questStartInteractionId,
        getCurrentQuestIdAtLocation,
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