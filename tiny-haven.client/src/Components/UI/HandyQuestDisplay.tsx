import { useState, useEffect } from "react";
import { useQuest } from "../../Contexts/QuestContext";
import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";

export const HandyQuestDisplay = () => {
  const { handyQuest } = useQuest();
  const { balance } = usePlayerBalance();
  const [showUI, setShowUI] = useState(false);
  const [previousQuestId, setPreviousQuestId] = useState<number | null>(null);

  useEffect(() => {
    if (!handyQuest) {
      setShowUI(false);
      setPreviousQuestId(null);
      return;
    }

    if (handyQuest.questId !== previousQuestId) {
      setShowUI(false);
      setPreviousQuestId(handyQuest.questId);
      
      const timer = setTimeout(() => {
        setShowUI(true);
      }, 50000);

      return () => clearTimeout(timer);
    } else {
      setShowUI(true);
    }
  }, [handyQuest, previousQuestId]);

  if (!handyQuest || !showUI) {
    return null;
  }

  let content = null;
  
  if (handyQuest.type === "quest_handy_smurf") {
    const requiredAmount = handyQuest.itemQuantity ?? 0;
    
    content = (
      <>
        <strong style={{
          display: "block",
          fontSize: "18px",
          marginBottom: "8px",
        }}>
          Postav dům
        </strong>
        <p style={{
          margin: 0,
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.9)"
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
          display: "block",
          fontSize: "18px",
          marginBottom: "8px"
        }}>
          Postav dům
        </strong>
        <p style={{
          margin: 0,
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.9)"
        }}>
          Už máš dost bobulek
        </p>
      </>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: "80px",
      right: "20px",
      background: "rgba(0, 0, 0, 0.85)",
      padding: "16px 20px",
      color: "white",
      zIndex: 9999
    }}>
      {content}
    </div>
  );
};