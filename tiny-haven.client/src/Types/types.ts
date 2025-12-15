export interface Asset {
  assetId: number;
  name: string;
  imageUrl: string | null;
  spanX: number;
  spanY: number;
  collision: boolean;

  // Foreign Key
  categoryId: number;

  // Navigation Properties
  category?: Category;
  locationMaps?: LocationMap[];
  quests?: Quest[];
}

export interface Category {
  categoryId: number;
  name: string;

  // Navigation Property
  assets?: Asset[];
}

export interface InteractionMap {
  interactionId: number;
  xOffsetStart: number;
  xOffsetEnd: number;
  yOffsetStart: number;
  yOffsetEnd: number;
  
  // Foreign Keys
  interactionTypeId: number;
  locationId: number;
  questId: number | null;

  // Navigation Properties
  interactionType?: InteractionType;
  locationMap?: LocationMap;
  quest?: Quest | null;
}

export interface InteractionType {
  interactionTypeId: number;
  name: string;

  // Navigation Property
  interactionMaps?: InteractionMap[];
}

export interface LocationMap {
  locationId: number;
  locationX: number;
  locationY: number;
  
  // Foreign Key
  assetId: number;

  // Navigation Properties
  asset?: Asset;
  interactionMaps?: InteractionMap[];
}

export interface Quest {
  questId: number;
  name: string;
  description: string;
  itemQuantity: number;
  rewardAmount: number;
  nextQuestId: number | null;

  // Foreign Key
  assetId: number;

  // Navigation Properties
  asset?: Asset;
  interactionMaps?: InteractionMap[];
}

