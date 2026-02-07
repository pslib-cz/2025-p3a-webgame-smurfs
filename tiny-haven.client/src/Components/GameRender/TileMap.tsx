import { use, useEffect, useState } from "react";
import styles from "./TileMap.module.css";
import { Entity } from "./Entity";
import { Player } from "./Player";
import { STEP_TIME, ZOOM_LEVEL } from "../../Data/GameData";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise, assetsPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement";
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
  const { interactions } = useInteractionMap();

  const { location, facing } = usePlayerMovement(
    collisionMap,
    gridColumns,
    gridRows
  );

  const { setActiveInteraction } = useInteractionContext();
  const activeInteraction = useInteractions(
    location.x,
    location.y,
    interactions
  );

  const { handleQuest } = useQuestActions(assetsData);

  const [questMessage, setQuestMessage] = useState<string | null>(null);
  const [questDoneMessage, setQuestDoneMessage] = useState<string | null>(null);

  
  useEffect(() => {
    setActiveInteraction(activeInteraction);
  }, [activeInteraction]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e") return;
      if (!activeInteraction) return;

      const result = handleQuest(activeInteraction);

      if (result && typeof result === "object" && result.type === "startQuestMsg") {
        const desc = result.description || "Hej! Potřebuju pomoct… dones mi pár věcí.";
        setQuestMessage(desc);
        setTimeout(() => setQuestMessage(null), 5000);
      }
      
      if (result === "inProcess"){
        setQuestMessage("Ještě u sebe nemáš věci co potřebuji, vrať se až je budeš mít.");
        setTimeout(() => setQuestMessage(null), 5000)
      }
      
      if (result === "completed") {
        setQuestDoneMessage("Už pro tebe nemám žádný další úkol.");
        setTimeout(() => setQuestDoneMessage(null), 3000);
      }

      if (result && typeof result === "object" && result.type === "endQuestMsg") {
        const descEnd = result.description || "Díky za quest bráchoo.";
        setQuestMessage(descEnd);
        setTimeout(() => setQuestMessage(null), 5000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeInteraction, handleQuest]);

  const pixelX = location.x * tileSize;
  const pixelY = location.y * tileSize;
  const offset = tileSize / 2;

  const worldStyle = {
    transform: `scale(${ZOOM_LEVEL}) translate3d(-${pixelX - offset}px, -${pixelY - offset}px, 0)`,
    transformOrigin: "0 0",
    transition: `transform ${STEP_TIME}ms linear`
  };

  return (
    <>
      <div className={styles.tileMap} style={worldStyle}>
        {locationMapData.map((entity: any) => (
          <Entity key={entity.locationId} data={entity} />
        ))}

        {generatedItems.map(item => (
          <Item key={item.id} data={item} />
        ))}

        <Player data={playerAsset} location={location} facing={facing} />

        {collisionMap.map((row: Boolean[], y: number) =>
          row.map(
            (collision: Boolean, x: number) =>
              collision && (
                <div
                  key={`${x}-${y}`}
                  style={{
                    gridColumn: x + 1,
                    gridRow: y + 1,
                    background: "rgba(255, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 0, 0, 0.3)",
                    zIndex: 999
                  }}
                />
              )
          )
        )}
      </div>

      {questDoneMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 200,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "10px 24px",
            borderRadius: 8,
            zIndex: 9999
          }}
        >
          {questDoneMessage}
        </div>
      )}

      {questMessage && (
        <div
        style={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.75)",
          color: "white",
          fontSize: "20px",
          padding: "12px 26px",
          zIndex: 9999
        }}
        >
          {questMessage}
        </div>
      )}
    </>
  );
};
