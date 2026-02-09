import { useQuest } from "../../Contexts/QuestContext";
import { use } from "react";
import { assetsPromise } from "../../api/gameResources";
import { itemTranslations } from "../../Data/itemTranslations";
import type { AssetDTO } from "../../Types/database-types";

export const ActiveQuest = () => {
  const { activeQuest } = useQuest();
  const assets = use(assetsPromise);

  if (!activeQuest) return null;

  const wantedAsset = assets.find(
    (a: AssetDTO) => a.assetId === activeQuest.wantedItemId
  );

  const itemName = itemTranslations[wantedAsset?.name ?? ""] ?? wantedAsset?.name ?? "neznámý předmět";

  const text =
    activeQuest.type === "quest_start"
      ? `Najdi ${activeQuest.itemQuantity}× ${itemName}`
      : activeQuest.type === "quest_end"
      ? `Přines zpět ${activeQuest.itemQuantity}× ${itemName}`
      : "";


  return (
    <div style={{
      position: "fixed",
      top: 282,
      right: 35,
      background: "rgba(0,0,0,0.7)",
      // backgroundImage: "url(/images/game_assets/ui/active_quest.png)",
      // backgroundSize: "contain",
      // backgroundPosition: "center",
      // backgroundRepeat: "no-repeat",
      color: "white",
      padding: "10px 32px",
      borderRadius: 8
    }}>
      <strong>Aktivní úkol</strong>
      <div>{text}</div>
    </div>
  );
};
