import { usePlayerLocation } from "../../../Contexts/PlayerLocationContext";
import styles from "./GameReset.module.css";

export const GameReset = () => {
    const { setLocation } = usePlayerLocation();

    function handleClearStorage() {
        if(window.confirm("Opravdu chceš začít odznovu? Tato akce je nenávratná.")) {
            localStorage.removeItem("SHOW_MOBILE_CONTROLS");
            localStorage.removeItem("player_inventory");
            localStorage.removeItem("player_balance");
            localStorage.removeItem("player_location");
            localStorage.removeItem("rpg_active_quest_id");
            localStorage.removeItem("rpg_handy_quest_id");
            localStorage.removeItem("rpg_completed_quest_ids");
            localStorage.removeItem("hasSeenTutorial");
            localStorage.removeItem("rpg_quest_start_location");
            localStorage.removeItem("rpg_quest_start_interaction_id");
            localStorage.removeItem("rpg_active_quest_ids_map");

            setLocation({ x: 36, y: 95 })
            
            window.location.reload();
        }
    }

    return (
        <button className={styles.gameResetBtn} onClick={handleClearStorage} title="Resetovat hru">
            <img src="images/game_assets/ui/reset.svg" alt="Reset hry" />
            <span>Resetovat hru</span>
        </button>
    )
}