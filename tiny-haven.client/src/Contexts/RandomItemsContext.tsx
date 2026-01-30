import { createContext, use, useContext, useMemo, useState } from 'react';
import { useGameSettings } from './GameSettingsContext'; 
import { type SpawnRequestDto, type SpawnResultDto, type PointDto, type AssetDTO, type RenderableItem } from '../Types/database-types';
import { assetsPromise } from '../api/gameResources';

interface RandomItemsContextType {
    itemsMap: number[][];
    generatedItems: RenderableItem[];
    spawnItems: (itemId: number) => Promise<void>;
    despawnItem: (x: number, y: number) => void;
}

const RandomItemsContext = createContext<RandomItemsContextType | undefined>(undefined);

export const RandomItemProvider = ({ children }: { children: React.ReactNode }) => {
    const assets = use(assetsPromise);
    const { gridColumns, gridRows } = useGameSettings();

    // Generate array
    const [itemsMap, setItemsMap] = useState<number[][]>(() => {
        return Array.from({ length: gridColumns }, () => Array(gridRows).fill(0));
    });

    const generatedItems = useMemo(() => {
        const list: RenderableItem[] = [];
        
        for (let x = 0; x < gridColumns; x++) {
            for (let y = 0; y < gridRows; y++) {
                const itemId = itemsMap[x][y];
                
                if (itemId > 0) {
                    const asset = assets.find((a: AssetDTO) => a.assetId === itemId);
                    
                    if (asset) {
                        list.push({
                            id: `item_${x}_${y}`,
                            x: x + 1,
                            y: y + 1,
                            assetId: itemId,
                            name: asset.name,
                            imageUrl: asset.imageUrl ?? "images/placeholder.svg",
                            spanX: asset.spanX,
                            spanY: asset.spanY
                        });
                    }
                }
            }
        }
        return list;
    }, [itemsMap, assets, gridColumns, gridRows]);

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
                    
                    data.newItems.forEach((item: any) => {
                        if (item.x >= 0 && item.x < gridColumns && item.y >= 0 && item.y < gridRows) {
                            newMap[item.x][item.y] = item.assetId; 
                        }
                    });
                    return newMap;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const despawnItem = (x: number, y: number) => {
        setItemsMap(prev => {
            const newMap = prev.map(col => [...col]);
            
            const targetX = x - 1; 
            const targetY = y - 1;

            if (newMap[targetX] && newMap[targetX][targetY] !== undefined) {
                newMap[targetX][targetY] = 0;
            }
            
            return newMap;
        });
    };

    return (
        <RandomItemsContext.Provider value={{ itemsMap, generatedItems, spawnItems, despawnItem }}>
            {children}
        </RandomItemsContext.Provider>
    );
};

export const useRandomItems = () => {
    const context = useContext(RandomItemsContext);
    if (!context) throw new Error("useGameMap must be used within GameMapProvider");
    return context;
};