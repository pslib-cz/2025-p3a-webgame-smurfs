import { use } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import { STEP_TIME, ZOOM_LEVEL } from "../../Data/GameData";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement";

export const TileMap = () => {
    const { tileSize, gridRows, gridColumns } = useGameSettings();

    const locationMapData = use(locationMapPromise);
    const playerAsset = use(playerAssetPromise);
    const collisionMap = use(collisionMapPromise);

    const { location, facing } = usePlayerMovement({ x: 90, y: 50 }, collisionMap, gridColumns, gridRows);

    const pixelX = location.x * tileSize;
    const pixelY = location.y * tileSize;
    const offset = tileSize / 2;

    const worldStyle = {
        transform: `scale(${ZOOM_LEVEL}) translate3d(-${pixelX - offset}px, -${pixelY - offset}px, 0)`,
        transformOrigin: '0 0',
        transition: `transform ${STEP_TIME}ms linear`
    };

    return (
        <div className={styles.tileMap} style={worldStyle}>
            {locationMapData.map((entity: any) => (
                <Entity key={entity.locationId} data={entity}/>
            ))}

            <Player data={playerAsset} location={location} facing={facing}/>

            {collisionMap.map((row: Boolean[], y: number) => (
                row.map((collision: Boolean, x: number) => (
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