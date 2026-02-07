import styles from "./MobileControls.module.css"
import "../../../styles/globals.css"
import { useControls, type ControlKey } from "../../../Contexts/ControlsContext";

export const MobileControls = () => {
    const { setControl } = useControls();

    const handlePress = (keys: ControlKey[]) => {
        keys.forEach(k => setControl(k, true));
    };

    const handleRelease = (keys: ControlKey[]) => {
        keys.forEach(k => setControl(k, false));
    };

    const bindBtn = (keys: ControlKey[]) => ({
        onMouseDown: (e: any) => { e.preventDefault(); handlePress(keys); },
        onMouseUp: (e: any) => { e.preventDefault(); handleRelease(keys); },
        onMouseLeave: () => { handleRelease(keys); },
        
        onTouchStart: (e: any) => { e.preventDefault(); handlePress(keys); },
        onTouchEnd: (e: any) => { e.preventDefault(); handleRelease(keys); }
    });

    return (
        <div>
            <div className={styles.joystick}>
                <button className={styles.up} {...bindBtn(['w'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka nahoru" /> </button>
                <button className={styles.left} {...bindBtn(['a'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka doleva" /> </button>
                <button className={styles.down} {...bindBtn(['s'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka dolů" /> </button>
                <button className={styles.right} {...bindBtn(['d'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka doprava" /> </button>
                
                {/* Diagonals */}
                <button className={styles.upLeft} {...bindBtn(['w', 'a'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka nahoru doleva" /> </button>
                <button className={styles.upRight} {...bindBtn(['w', 'd'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka nahoru doprava" /> </button>
                <button className={styles.downLeft} {...bindBtn(['s', 'a'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka dolů doleva" /> </button>
                <button className={styles.downRight} {...bindBtn(['s', 'd'])}> <img src="images/game_assets/ui/arrow.svg" alt="Šipka dolů doprava" /> </button>
            </div>

            <button className={styles.actionButton} {...bindBtn(['e'])}>
                <img src="images/game_assets/ui/interaction.svg" alt="Akční tlačítko" />
            </button>
        </div>
    )
}