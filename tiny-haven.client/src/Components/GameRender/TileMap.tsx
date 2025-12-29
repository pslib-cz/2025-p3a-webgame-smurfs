import { use, useMemo, useState } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import type { CollisionMap, PlayerLocation } from "../../Types/player-data";
import { GRID_COLLUMNS, GRID_ROWS, TILE_SIZE, ZOOM_LEVEL } from "../Data/GameData";
import type { LocationMapDTO } from "../../Types/database-types";

const locationMapFetch = fetch("/api/LocationMaps").then(x => x.json())
const InteractionMapFetch = fetch("/api/InteractionMaps").then(x => x.json())
const playerAssetFetch = fetch("api/Assets/2").then(x => x.json())

export const TileMap = () => {
    const locationMapData = use(locationMapFetch);
    const interactionMapData = use(InteractionMapFetch);
    const playerAsset = use(playerAssetFetch)

    const collisionMap: CollisionMap = useMemo(() => {
        const map = Array.from({ length: GRID_ROWS }, () => 
            Array(GRID_COLLUMNS).fill(false) 
        );

        if (!locationMapData) return map; 

        locationMapData.forEach((entity: LocationMapDTO) => {
            for (let cy = 0; cy < entity.spanY; cy++) {
                const targetY = (entity.locationY - 1) + cy;
                if (targetY < 0 || targetY >= GRID_ROWS) continue;

                for (let cx = 0; cx < entity.spanX; cx++) {
                    const targetX = (entity.locationX - 1) + cx;
                    if (targetX < 0 || targetX >= GRID_COLLUMNS) continue;

                    map[targetY][targetX] = true;
                }
            }
        });

        return map;

    }, [locationMapData]);

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

            {collisionMap.map((row, y) => (
                row.map((collision, x) => (
                    collision && (
                        <div key={`${x}-${y}`} style={{
                            gridColumn: x + 1,
                            gridRow: y + 1,
                            background: 'rgba(255, 0, 0, 0.3)',
                            border: "1px solid rgba(255, 0, 0, 0.3)",
                            zIndex: 999
                       }} />
                    )
                ))
            ))}
        </div>
    )
}