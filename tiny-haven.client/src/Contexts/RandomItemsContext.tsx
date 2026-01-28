import React, { createContext, useContext, useState } from 'react';
import { useGameSettings } from './GameSettingsContext'; 
import { type SpawnRequestDto, type SpawnResultDto, type PointDto } from '../Types/database-types';

interface RandomItemsContextType {
    itemsMap: number[][]; 
    spawnItems: (itemId: number) => Promise<void>;
}

const RandomItemsContext = createContext<RandomItemsContextType | undefined>(undefined);

export const RandomItemProvider = ({ children }: { children: React.ReactNode }) => {
    const { gridColumns, gridRows } = useGameSettings();

    const [itemsMap, setItemsMap] = useState<number[][]>(() => {
        return Array.from({ length: gridColumns }, () => Array(gridRows).fill(0));
    });

    const spawnItems = async (itemId: number) => {
        let currentAmount = 0;
        const occupiedList: PointDto[] = [];

        for (let x = 0; x < gridColumns; x++) {
            for (let y = 0; y < gridRows; y++) {
                if (itemsMap[x][y] !== 0) {
                    occupiedList.push({ x, y });
                    if (itemsMap[x][y] === itemId) currentAmount++;
                }
            }
        }

        const payload: SpawnRequestDto = {
            itemId,
            currentAmount,
            existingItemLocations: occupiedList
        };

        try {
            const response = await fetch('/api/map/generateItems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) return;

            const data: SpawnResultDto = await response.json();

            if (data.success && data.newItems.length > 0) {
                setItemsMap(prev => {
                    const newMap = prev.map(col => [...col]); 
                    data.newItems.forEach(pt => {
                        if (pt.x >= 0 && pt.x < gridColumns && pt.y >= 0 && pt.y < gridRows) {
                            newMap[pt.x][pt.y] = itemId;
                        }
                    });
                    return newMap;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <RandomItemsContext.Provider value={{ itemsMap, spawnItems }}>
            {children}
        </RandomItemsContext.Provider>
    );
};

export const useGenerateItems = () => {
    const context = useContext(RandomItemsContext);
    if (!context) throw new Error("useGameMap must be used within GameMapProvider");
    return context;
};