import type { AssetDTO } from "./database-types";

export interface PlayerLocation {
    x: number;
    y: number;
}

export interface AssetInventory {
    assetId: number;
    imageUrl: string;
    name: string;
}

export interface InventorySlot {
    slotIndex: number;
    asset: AssetInventory | null;
    amount: number
}

export type FacingDirection = 'left' | 'right';