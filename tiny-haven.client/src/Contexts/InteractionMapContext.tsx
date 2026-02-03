import React, { createContext, useContext, useMemo, use } from 'react';
import { type InteractionMapDTO, type QuestDTO } from '../Types/database-types';
import { useRandomItems } from './RandomItemsContext'; 
import { InteractionMapPromise, questsPromise } from '../api/gameResources';

interface InteractionMapContextType {
    interactions: InteractionMapDTO[];
}

const InteractionMapContext = createContext<InteractionMapContextType | undefined>(undefined);

export const InteractionMapProvider = ({ children }: { children: React.ReactNode }) => {
    const dbInteractions = use(InteractionMapPromise) as InteractionMapDTO[];
    const dbQuests = use(questsPromise) as QuestDTO[];

    const { generatedItems } = useRandomItems(); 

    // Lookup AssetId to QuestId
    const itemToQuestLookup = useMemo(() => {
        const map: Record<number, QuestDTO> = {};
        
        dbQuests.forEach(quest => {
            if (quest.rewardItemId && (quest.type === "pickup_item" || quest.type === "add_to_balance")) {
                map[quest.rewardItemId] = quest;
            } 
        });
        return map;
    }, [dbQuests]);

    // Merge db interactions with local
    const interactions = useMemo(() => {
        const combinedList: InteractionMapDTO[] = [...dbInteractions];

        generatedItems.forEach(item => {
            const linkedQuest = itemToQuestLookup[item.assetId];
            
            if (linkedQuest) {
                combinedList.push({
                    interactionId: -1 * ((item.x * 1000) + item.y),
                    
                    locationX: item.x,
                    locationY: item.y,
                    
                    xOffsetStart: 1, 
                    xOffsetEnd: 1, 
                    yOffsetStart: 1, 
                    yOffsetEnd: 1,
                    
                    type: linkedQuest.type,
                    quest: linkedQuest
                });
            }
        });

        return combinedList;
    }, [dbInteractions, generatedItems, itemToQuestLookup]);

    return (
        <InteractionMapContext.Provider value={{ interactions }}>
            {children}
        </InteractionMapContext.Provider>
    );
};

export const useInteractionMap = () => {
    const context = useContext(InteractionMapContext);
    if (!context) throw new Error("useInteractions must be used within InteractionProvider");
    return context;
};