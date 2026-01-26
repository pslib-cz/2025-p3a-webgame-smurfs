import { use, useEffect } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import { STEP_TIME, ZOOM_LEVEL } from "../../Data/GameData";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement";
import { useInventory } from "../../Contexts/InventoryContext";
import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise, InteractionMapPromise, assetsPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement"
import { useInteractions } from "../../Hooks/useInteractions";
import { useQuestActions } from "../../Hooks/useQuestActions";

export const TileMap = () => {
    const { tileSize, gridRows, gridColumns } = useGameSettings();

    const locationMapData = use(locationMapPromise);
    const playerAsset = use(playerAssetPromise);
    const collisionMap = use(collisionMapPromise);
    const assetsData = use(assetsPromise);

    const { location, facing } = usePlayerMovement( collisionMap, gridColumns, gridRows );

    const playerInventory = useInventory();
    const playerBalance = usePlayerBalance();
    const { location, facing } = usePlayerMovement({ x: 90, y: 50 }, collisionMap, gridColumns, gridRows);

    //---//
    //Interaction mapa

    const interactions = use(InteractionMapPromise);

    const activeInteraction = useInteractions(
        location.x,
        location.y,
        interactions
    );

      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "e" && activeInteraction) {
            console.log("Spouštím quest:", activeInteraction.quest.name);
            // tady později fetch na backend
          }
        };
      
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }, [activeInteraction]);


      const { handleQuest } = useQuestActions(assetsData);


      // ..........Pickup item........... //


      useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === "e" && activeInteraction) {
        handleQuest(activeInteraction.quest);
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeInteraction]);

    //---//

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
                            background: 'rgba(255, 0, 0, 0.2)',
                            border: "1px solid rgba(255, 0, 0, 0.3)",
                            zIndex: 999
                       }} />
                    )
                ))
            ))}

            {activeInteraction && (
            <div
                style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -80px)",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "14px"
                }}
            >
                <b>E</b>
            </div>
            )}
        </div>
    )
}