import { use, useEffect, useRef } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";
import { Player } from "./Player";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
//import { useInventory } from "../../Contexts/InventoryContext";
//import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise, assetsPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement"
import { useInteractions } from "../../Hooks/useInteractions";
import { useQuestActions } from "../../Hooks/useQuestActions";
import { useInteractionContext } from "../../Contexts/InteractionContext";
import { useRandomItems } from "../../Contexts/RandomItemsContext";
import { Item } from "./Item";
import { useInteractionMap } from "../../Contexts/InteractionMapContext";
import type { AssetDTO, LocationMapDTO } from "../../Types/database-types";
import { useControls } from "../../Contexts/ControlsContext";

export const TileMap = () => {
    const { config: { tileSize, gridRows, gridColumns } } = useGameSettings();
    const { controls } = useControls();

    const locationMapData = use(locationMapPromise);
    const playerAsset = use(playerAssetPromise);
    const collisionMap = use(collisionMapPromise);
    const assetsData = use(assetsPromise);
    const { generatedItems } = useRandomItems();
    const { stepTime } = useGameSettings();

    // Movement
    const { location, facing } = usePlayerMovement( collisionMap, gridColumns, gridRows );

    // Interactions
    const { interactions } = useInteractionMap();
    const { setActiveInteraction } = useInteractionContext();
    const { handleQuest } = useQuestActions(assetsData);
    const isInteracting = useRef(false);

    const activeInteraction = useInteractions(location.x, location.y, interactions);

    useEffect(() => {
        setActiveInteraction(activeInteraction);
    }, [activeInteraction]);

    useEffect(() => {
        if (!controls.e) {
            isInteracting.current = false;
            return;
        }

        if (controls.e && activeInteraction && !isInteracting.current) {
            isInteracting.current = true;
            
            console.log("Action triggered via Context");
            handleQuest(activeInteraction);
        }
    }, [controls.e, activeInteraction, handleQuest]);

    const pixelX = location.x * tileSize;
    const pixelY = location.y * tileSize;
    const offset = tileSize / 2;

    const worldStyle = {
        transform: `scale(var(--scale)) translate3d(-${pixelX - offset}px, -${pixelY - offset}px, 0)`,
        transformOrigin: '0 0',
        willChange: 'transform',
        transition: `transform ${stepTime}ms linear`,
        transitionDelay: '0ms'
    };

    return (
        <div className={styles.tileMap} style={worldStyle}>
            {locationMapData.map((entity: LocationMapDTO) => {
                const asset = assetsData.find((a: AssetDTO) => a.assetId === entity.assetId);
                if (!asset) return;
                if (asset.visible === false) { return null; }
                return <Entity key={entity.locationId} data={entity}/>
            })}

            {generatedItems.map(item => (
                <Item key={item.id} data={item}/>
            ))}

            <Player data={playerAsset} location={location} facing={facing}/>

            {/* {collisionMap.map((row: Boolean[], y: number) => (
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
            ))} */}
        </div>
    )
}