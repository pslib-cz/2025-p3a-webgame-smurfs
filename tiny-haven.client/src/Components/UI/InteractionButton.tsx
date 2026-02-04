import { useInteractionContext } from "../../Contexts/InteractionContext";

export const InteractionButton = () => {
    const { activeInteraction } = useInteractionContext();
    if (!activeInteraction) return null;

    return (
        <div
            style={{
                fontWeight: "100",
                position: "fixed",
                left: "50%",
                bottom: "8rem",
                transform: "translateX(-50%)",
                // background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "24px",
                pointerEvents: "none"
            }}
        >
            <b>Press [ E ]</b>
        </div>
    );
};