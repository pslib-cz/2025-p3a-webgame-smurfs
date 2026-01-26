// Categories DTO
export interface CategoryDTO {
  categoryId: number;
  name: string;
}

// Assets DTO
export interface AssetDTO {
  assetId: number;
  name: string;
  imageUrl: string | null;
  spanX: number;
  spanY: number;
  collision: boolean;
  visible: boolean;
  categoryName: string;
}

// Location maps DTO
export interface LocationMapDTO {
  locationId: number;
  locationX: number;
  locationY: number;
  assetId: number;
  imageUrl: string | null;
  name: string;
  spanX: number;
  spanY: number;
  collision: boolean;
  visible: boolean;
}

// Quests DTO
export interface QuestDTO {
  questId: number;
  name: string;
  description: string;
  type: string;
  wantedItemId: number | null;
  rewardItemId: number | null;
  itemQuantity: number | null;
  rewardAmount: number | null;
  nextQuestId: number | null;
}

// Interaction maps DTO
export interface InteractionMapDTO {
  interactionId: number;
  xOffsetStart: number;
  xOffsetEnd: number;
  yOffsetStart: number;
  yOffsetEnd: number;
  type: string;
  locationX: number;
  locationY: number;
  quest: QuestDTO;
}

// Collision map DTO
export interface CollisionMap {
  collisionMap: boolean[][];
}

// Game config DTO
export interface GameConfigDTO {
  tileSize: number;
  gridColumns: number;
  gridRows: number;
  inventorySize: number;
  startingBalance: number;
}