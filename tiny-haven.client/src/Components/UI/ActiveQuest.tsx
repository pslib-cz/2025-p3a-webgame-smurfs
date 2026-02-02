import { useQuest } from "../../Contexts/QuestContext";

export const ActiveQuest = () => {
  const { activeQuest } = useQuest();

  if (!activeQuest) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "10px 14px",
      borderRadius: 8
    }}>
      <strong>Aktivní quest</strong>
      <div>
        Přines {activeQuest.wantedItemId}{" "}
        {activeQuest.itemQuantity}×
      </div>
    </div>
  );
};
