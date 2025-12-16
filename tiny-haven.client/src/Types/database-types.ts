export interface Category {
  categoryId: number;
  name: string;

  // Navigation property
  assets?: Asset[];
}

export interface Asset {
  assetId: number;
  name: string;
  imageUrl?: string | null;
  spanX: number;
  spanY: number;
  collision: boolean;
  visible: boolean;

  // Foreign key
  categoryId: number;
  category?: Category;

  // Navigation property
  locationMaps?: LocationMap[];
  wantedInQuests?: Quest[];
  rewardInQuests?: Quest[];
}

export interface LocationMap {
  locationId: number;
  locationX: number;
  locationY: number;

  // Foreign key
  assetId: number;
  asset?: Asset;

  // Navigation property
  interactionMaps?: InteractionMap[];
}

export interface Quest {
  questId: number;
  name: string;
  description: string;
  type: string;
  itemQuantity?: number | null;
  rewardAmount?: number | null;

  // Foreign key
  wantedItemId?: number | null;
  wantedItem?: Asset;

  rewardItemId?: number | null;
  rewardItem?: Asset;

  nextQuestId?: number | null;
  nextQuest?: Quest;

  // Navigation property
  interactionMaps?: InteractionMap[];
}

export interface InteractionMap {
  interactionId: number;
  xOffsetStart: number;
  xOffsetEnd: number;
  yOffsetStart: number;
  yOffsetEnd: number;

  // Foreign key
  locationId: number;
  locationMap?: LocationMap;
  
  questId: number;
  quest?: Quest | null;
}