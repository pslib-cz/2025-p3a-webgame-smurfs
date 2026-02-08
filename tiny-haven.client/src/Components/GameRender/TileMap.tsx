import { use, useEffect, useState, useRef, useMemo } from "react";
import styles from "./TileMap.module.css";
import { Entity } from "./AssetsDisplay/Entity";
import { Player } from "./AssetsDisplay/Player";
import { Item } from "./AssetsDisplay/Item";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { useControls } from "../../Contexts/ControlsContext";
import { useInteractionContext } from "../../Contexts/InteractionContext";
import { useRandomItems } from "../../Contexts/RandomItemsContext";
import { useInteractionMap } from "../../Contexts/InteractionMapContext";
import { collisionMapPromise, locationMapPromise, playerAssetPromise, assetsPromise } from "../../api/gameResources";
import { usePlayerMovement } from "../../Hooks/usePlayerMovement";
import { useInteractions } from "../../Hooks/useInteractions";
import { useQuestActions } from "../../Hooks/useQuestActions";
import { useHandyQuestActions } from "../../Hooks/useHandyQuestActions";
import type { AssetDTO, LocationMapDTO } from "../../Types/database-types";
import { useQuest } from "../../Contexts/QuestContext";
import { SmurfHouse } from "./AssetsDisplay/SmurfHouse";

export const TileMap = () => {
  const { config: { tileSize, gridRows, gridColumns }, stepTime } = useGameSettings();
  const { controls } = useControls();

  const locationMapData = use(locationMapPromise);
  const playerAsset = use(playerAssetPromise);
  const collisionMap = use(collisionMapPromise);
  const assetsData = use(assetsPromise);

  const { generatedItems } = useRandomItems();
  const { interactions } = useInteractionMap();

  const { location, facing } = usePlayerMovement(collisionMap, gridColumns, gridRows);

  const { setActiveInteraction } = useInteractionContext();
  const activeInteraction = useInteractions(
    location.x,
    location.y,
    interactions
  );

  const { handleQuest } = useQuestActions(assetsData);
  const { handleHandyQuestInteraction } = useHandyQuestActions();
  const { completedQuestIds, isQuestCompleted } = useQuest();

  const [questMessage, setQuestMessage] = useState<string | null>(null);
  const [questDoneMessage, setQuestDoneMessage] = useState<string | null>(null);

  const prevEPressed = useRef(false);

  useEffect(() => {
    setActiveInteraction(activeInteraction);
  }, [activeInteraction, setActiveInteraction]);

  useEffect(() => {
    const isEPressed = controls.e;
    if (isEPressed && !prevEPressed.current && activeInteraction) {
      const result = handleQuest(activeInteraction);

      if (result && typeof result === "object" && result.type === "startQuestMsg") {
        const desc = result.description || "Hej! Potřebuju pomoct… dones mi pár věcí.";
        setQuestMessage(desc);
        setTimeout(() => setQuestMessage(null), 5000);
      }

      if (result === "inProcess") {
        setQuestMessage("Ještě u sebe nemáš věci co potřebuji, vrať se až je budeš mít.");
        setTimeout(() => setQuestMessage(null), 5000);
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

      // .......... HANDY QUEST ...........
      if (
        activeInteraction.quest &&
        (activeInteraction.quest.type === "quest_handy_smurf" ||
          activeInteraction.quest.type === "quest_handy_smurf_2")
      ) {
        const handyResult = handleHandyQuestInteraction(activeInteraction.quest);

        if (handyResult) {
          if (handyResult.type === "start") {
            setQuestMessage(handyResult.description);
            setTimeout(() => setQuestMessage(null), 5000);
          }

          if (handyResult.type === "missingItems") {
            setQuestMessage("Nemáš ještě dostatek bobulek.");
            setTimeout(() => setQuestMessage(null), 5000);
          }

          if (handyResult.type === "done") {
            setQuestMessage(handyResult.description);
            setTimeout(() => setQuestMessage(null), 5000);
          }
        }
      }
    }

    prevEPressed.current = isEPressed;
  }, [controls.e, activeInteraction, handleQuest, handleHandyQuestInteraction]);

  const pixelX = location.x * tileSize;
  const pixelY = location.y * tileSize;
  const offset = tileSize / 2;

  const worldStyle = {
    transform: `scale(var(--scale)) translate3d(-${pixelX - offset}px, -${pixelY - offset}px, 0)`,
    transformOrigin: '0 0',
    transition: `transform ${stepTime}ms linear`,
    transitionDelay: '0ms'
  };

  const isHandySmurfQuestFinished = useMemo(() => 
    isQuestCompleted(12),
    [completedQuestIds]
  );
  
  const smurfHouseAsset: AssetDTO = assetsData.find((a: AssetDTO) => a.assetId === 25)

  const smurfHouseData: LocationMapDTO = {
    locationId: 9999,
    locationX: 30,
    locationY: 89,
    assetId: smurfHouseAsset.assetId,
    imageUrl: isHandySmurfQuestFinished
    ? "images/game_assets/buildings/smurf_house.svg"
    : smurfHouseAsset?.imageUrl ?? null,
    name: smurfHouseAsset.name,
    spanX: smurfHouseAsset.spanX,
    spanY: smurfHouseAsset.spanY,
    collision: true,
    visible: true
  }

  return (
    <>
      <div className={styles.tileMap} style={worldStyle}>
        {locationMapData.map((entity: LocationMapDTO) => {
          const asset = assetsData.find((a: AssetDTO) => a.assetId === entity.assetId);
          if (!asset) return null;
          if (asset.visible === false) return null;
          return <Entity key={entity.locationId} data={entity} />;
        })}

        {generatedItems.map(item => (
          <Item key={item.id} data={item} />
        ))}
        
        <SmurfHouse data={smurfHouseData}/>
        <Player data={playerAsset} location={location} facing={facing} />

        {/* <figure className={styles.smurfHouse} style={{
          gridColumn: `30 span ${smurfHouse.spanX}`,
          gridRow: `89 span ${smurfHouse.spanY}`,
        }}>
          <img src={isHandySmurfQuestFinished ? "images/game_assets/smurf_house.svg" : smurfHouse.imageUrl || "images/game_assets/placeholder-image.svg"} alt={smurfHouse.name}></img>
        </figure> */}

        {/* Collision map visualization - uncomment for debugging */}
        {/* {collisionMap.map((row: Boolean[], y: number) =>
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
        )} */}
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