import { createContext, useContext, useEffect, useState } from "react";
import type { AssetInventory, InventorySlot } from "../Types/player-data";
import { useGameSettings } from "./GameSettingsContext";

interface InventoryContextType {
    slots: InventorySlot[];
    addItemToInventory: (item: AssetInventory, amount?: number) => boolean;
    removeItemFromInventory: (assetId: number, amount?: number) => boolean;
    getItemAmount: (assetId: number) => number
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
    const { inventorySize } = useGameSettings();

    const [slots, setSlots] = useState<InventorySlot[]>(() => {
        const saved = localStorage.getItem('playerInventory');
        let initialSlots: InventorySlot[] = [];

        if (saved) {
            initialSlots = JSON.parse(saved);
        } else {
            initialSlots = Array.from({ length: inventorySize }, (_, i) => ({
                slotIndex: i,
                asset: null,
                amount: 0
            }));
        }

        // Kontrola možné změny velikosti inventáře na backendu
        if (initialSlots.length < inventorySize) {
            const extraSlots = Array.from({ length: inventorySize - initialSlots.length }, (_, i) => ({
                slotIndex: initialSlots.length + i,
                asset: null,
                amount: 0
            }));
            return [...initialSlots, ...extraSlots];
        } 
        else if (initialSlots.length > inventorySize) {
            return initialSlots.slice(0, inventorySize);
        }

        return initialSlots;
    });

    // Uložení inventáře
    useEffect(() => {
        localStorage.setItem('playerInventory', JSON.stringify(slots));
    }, [slots]);

    // addItemToInventory(asset, množství)
    const addItemToInventory = (item: AssetInventory, amount: number = 1): boolean => {
        const newSlots = [...slots];
        let remaining = amount;

        // A. Pokus o přidání itemů k existujícím itemům stejného typu
        for (const slot of newSlots) {
            if (slot.asset && slot.asset.assetId === item.assetId) {
                slot.amount += remaining;
                remaining = 0;
                break;
            }
        }

        // B. Uložení nového itemu do inventáře
        if (remaining > 0) {
            const emptySlot = newSlots.find(s => s.asset === null);
            if (emptySlot) {
                emptySlot.asset = item; 
                emptySlot.amount = remaining;
                remaining = 0;
            }
        }

        if (remaining === 0) {
            setSlots(newSlots);
            return true;
        }

        console.warn("Inventory Full!");
        return false;
    };

    // removeItemFromInventory(AssetId, množství)
    const removeItemFromInventory = (assetId: number, amount: number = 1): boolean => {
        const newSlots = [...slots];
        const slotIndex = newSlots.findIndex(s => s.asset?.assetId === assetId);

        if (slotIndex === -1) return false;

        const slot = newSlots[slotIndex];
        
        if (slot.amount > amount) {
            slot.amount -= amount;
        } else {
            slot.asset = null;
            slot.amount = 0;
        }

        setSlots(newSlots);
        return true;
    };

    // getItemAmount(AssetId)
    const getItemAmount = (assetId: number): number => {
        const slot = slots.find(s => s.asset?.assetId === assetId);
        return slot ? slot.amount : 0;
    };

    return (
        <InventoryContext.Provider value={{ slots, addItemToInventory, removeItemFromInventory, getItemAmount }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) throw new Error("useInventory must be used within InventoryProvider");
    return context;
    
};