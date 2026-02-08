import { useQuest } from "../../Contexts/QuestContext";
import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";

export const HandyQuestDisplay = () => {
  const { handyQuest } = useQuest();
  const { balance } = usePlayerBalance();

  if (!handyQuest) return null;

  let content = null;

  if (handyQuest.type === "quest_handy_smurf") {
    const requiredAmount = handyQuest.itemQuantity ?? 0;

    content = (
      <>
        <strong style={{
          fontSize: "16px"
        }}>
          Postav dům
        </strong>
        <p style={{
          fontSize: "16px",
          margin: 0
        }}>
          Máš {balance}/{requiredAmount} bobulek
        </p>
      </>
    );
  } 
  else if (handyQuest.type === "quest_handy_smurf_2") {

    content = (
      <>
        <strong style={{
          fontSize: "16px"
        }}>
          Postav dům
        </strong>
        <p style={{
          fontSize: "16px",
          margin: 0
        }}>
          Už máš dost bobulek
        </p>
      </>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 105,
      right: 35,
      background: "rgba(0,0,0,0.7)",
      borderRadius: 8,
      padding: "10px 32px",
      color: "white",
      zIndex: 9999,
    }}>
      {content}
    </div>
  );
};