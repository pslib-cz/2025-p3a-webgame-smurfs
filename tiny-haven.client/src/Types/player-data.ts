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

export interface Quest {
    id: string;
    name: string;
    type: "pickupItem" | "talk" | "trigger";
    assetId?: number;
    amount?: number;
  }
