import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { useInteractionContext } from "../../Contexts/InteractionContext";

export const InteractionButton = () => {
    const { activeInteraction } = useInteractionContext();
    if (!activeInteraction) return null;

    const { showControls } = useGameSettings();

    return (
        <div
            style={{
                fontWeight: "100",
                position: "fixed",
                left: "50%",
                bottom: showControls ? "5rem" : "8rem",
                transform: "translateX(-50%)",
                // background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: showControls ? "1rem" : "1.5rem",
                pointerEvents: "none"
            }}
        >
            <b>Press [ {showControls ? "Action button" : "E"} ]</b>
        </div>
    );
};