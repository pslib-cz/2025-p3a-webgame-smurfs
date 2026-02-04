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
                <button className={styles.up} {...bindBtn(['w'])}>⬆️</button>
                <button className={styles.left} {...bindBtn(['a'])}>⬅️</button>
                <button className={styles.down} {...bindBtn(['s'])}>⬇️</button>
                <button className={styles.right} {...bindBtn(['d'])}>➡️</button>
                
                {/* Diagonals */}
                <button className={styles.upLeft} {...bindBtn(['w', 'a'])}>↖️</button>
                <button className={styles.upRight} {...bindBtn(['w', 'd'])}>↗️</button>
                <button className={styles.downLeft} {...bindBtn(['s', 'a'])}>↙️</button>
                <button className={styles.downRight} {...bindBtn(['s', 'd'])}>↘️</button>
            </div>

            <button className={styles.actionButton} {...bindBtn(['e'])}>
                ⏺️
            </button>
        </div>
    )
}