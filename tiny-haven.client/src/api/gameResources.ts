// Fetch config
export const configPromise = fetch("/api/GameConfig").then(x => x.json());

// Fetch world data
export const locationMapPromise = fetch("/api/map/locations").then(x => x.json());
export const collisionMapPromise = fetch("/api/map/collisions").then(x => x.json());
export const InteractionMapPromise = fetch("/api/interactions").then(x => x.json());

// Fetch player asset
export const playerAssetPromise = fetch("/api/Assets/2").then(x => x.json());