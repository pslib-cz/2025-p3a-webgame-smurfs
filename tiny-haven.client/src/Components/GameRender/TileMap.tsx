import { use, useEffect } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import { STEP_TIME, ZOOM_LEVEL } from "../../Data/GameData";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
//import { useInventory } from "../../Contexts/InventoryContext";
//import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise, InteractionMapPromise, assetsPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement"
import { useInteractions } from "../../Hooks/useInteractions";
import { useQuestActions } from "../../Hooks/useQuestActions";
import { useInteractionContext } from "../../Contexts/InteractionContext";
import { useRandomItems } from "../../Contexts/RandomItemsContext";
import { Item } from "./Item";
import { useInteractionMap } from "../../Contexts/InteractionMapContext";

export const TileMap = () => {
    const { tileSize, gridRows, gridColumns } = useGameSettings();

    const locationMapData = use(locationMapPromise);
    const playerAsset = use(playerAssetPromise);
    const collisionMap = use(collisionMapPromise);
    const assetsData = use(assetsPromise);

    const { generatedItems } = useRandomItems();

    const { location, facing } = usePlayerMovement( collisionMap, gridColumns, gridRows );

    //const playerInventory = useInventory();
    //const playerBalance = usePlayerBalance();

    //---//
    //Interaction mapa

    const { interactions } = useInteractionMap();

    const { setActiveInteraction } = useInteractionContext();

    const activeInteraction = useInteractions(
    location.x,
    location.y,
    interactions
    );

    useEffect(() => {
    setActiveInteraction(activeInteraction);
    }, [activeInteraction]);

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
        handleQuest(activeInteraction);
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

            {generatedItems.map(item => (
                <Item key={item.id} data={item}/>
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
        </div>
    )
}