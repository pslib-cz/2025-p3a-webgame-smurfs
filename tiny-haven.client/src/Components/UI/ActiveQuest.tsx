import { useQuest } from "../../Contexts/QuestContext";

export const ActiveQuest = () => {
  const { activeQuest } = useQuest();

  if (!activeQuest) return null;

  const text =
    activeQuest.type === "quest_start"
        ? `Najdi ${activeQuest.itemQuantity}× ${activeQuest.wantedItemId}`
        : activeQuest.type === "quest_end"
        ? `Přines zpět ${activeQuest.itemQuantity}× ${activeQuest.wantedItemId}`
        : "";


  return (
    <div style={{
      position: "fixed",
      top: 115,
      right: 45,
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "10px 32px",
      borderRadius: 8
    }}>
      <strong>Aktivní quest</strong>
      <div>{text}</div>
    </div>
  );
};
