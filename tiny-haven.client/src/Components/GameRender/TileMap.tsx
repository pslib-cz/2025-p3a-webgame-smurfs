import { use, useState } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import type { PlayerLocation } from "../../Types/player-data";
import { TILE_SIZE, ZOOM_LEVEL } from "../Data/GameData";

const locationMapFetch = fetch("/api/LocationMaps").then(x => x.json())
const InteractionMapFetch = fetch("/api/InteractionMaps").then(x => x.json())
const playerAssetFetch = fetch("api/Assets/2").then(x => x.json())

export const TileMap = () => {
    const locationMapData = use(locationMapFetch);
    const interactionMapData = use(InteractionMapFetch);
    const playerAsset = use(playerAssetFetch)
    const [location, setLocation] = useState<PlayerLocation>({x: 90, y: 50})


    const pixelX = location.x * TILE_SIZE;
    const pixelY = location.y * TILE_SIZE;
    const offset = TILE_SIZE / 2;

    const worldStyle = {
        transform: `scale(${ZOOM_LEVEL}) translate3d(-${pixelX - offset}px, -${pixelY - offset}px, 0)`,
        transformOrigin: '0 0',
    };

    return (
        <div className={styles.tileMap} style={worldStyle}>
            {locationMapData.map((entity: any) => (
                <Entity key={entity.locationId} data={entity}/>
            ))}

            <Player data={playerAsset} location={location}/>
        </div>
    )
}