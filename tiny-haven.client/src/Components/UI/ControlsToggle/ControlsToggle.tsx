import { useGameSettings } from "../../../Contexts/GameSettingsContext";
import styles from "./ControlsToggle.module.css"

export const ControlsToggle = () => {
    const { showControls, setShowControls } = useGameSettings();

    function handlePress() {
        if (showControls) { setShowControls(false) }
        else { setShowControls(true) }
    }

    return (
        <button className={styles.controlsToggleBtn} onClick={handlePress} 
        title={showControls ? "Skrýt tlačítka pro ovládání" : "Zobrazit tlačítka pro ovládání"}>
            <img 
            src={showControls ? "images/game_assets/ui/controls_on.svg" : "images/game_assets/ui/controls_off.svg"} 
            alt={showControls ? "Viditelná tlačítka pro ovládání" : "Skrytá tlačítka pro ovládání"} />
        </button>
    )
}