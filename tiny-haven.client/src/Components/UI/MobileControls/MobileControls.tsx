import styles from "./MobileControls.module.css"

interface MobileControlsProps {
    setKey: (key: 'w' | 'a' | 's' | 'd', value: boolean) => void;
}

export const MobileControls = ({ setKey }: MobileControlsProps) => {
    const handlePress = (keys: Array<'w' | 'a' | 's' | 'd'>) => {
        keys.forEach(key => setKey(key, true));
    };

    const handleRelease = (keys: Array<'w' | 'a' | 's' | 'd'>) => {
        keys.forEach(key => setKey(key, false));
    };

    return (
        <div>
            <div className={styles.joystick}>
                {/* <button className={styles.up}>⬆️</button>
                <button className={styles.left}>⬅️</button>
                <button className={styles.down}>⬇️</button>
                <button className={styles.right}>➡️</button>

                <button className={styles.upLeft}>↖️</button>
                <button className={styles.downLeft}>↙️</button>
                <button className={styles.downRight}>↘️</button>
                <button className={styles.upRight}>↗️</button> */}

                <button 
                    className={styles.up}
                    onPointerDown={() => handlePress(['w'])}
                    onPointerUp={() => handleRelease(['w'])}
                    onPointerLeave={() => handleRelease(['w'])}
                >⬆️</button>
                
                <button 
                    className={styles.left}
                    onPointerDown={() => handlePress(['a'])}
                    onPointerUp={() => handleRelease(['a'])}
                    onPointerLeave={() => handleRelease(['a'])}
                >⬅️</button>
                
                <button 
                    className={styles.down}
                    onPointerDown={() => handlePress(['s'])}
                    onPointerUp={() => handleRelease(['s'])}
                    onPointerLeave={() => handleRelease(['s'])}
                >⬇️</button>
                
                <button 
                    className={styles.right}
                    onPointerDown={() => handlePress(['d'])}
                    onPointerUp={() => handleRelease(['d'])}
                    onPointerLeave={() => handleRelease(['d'])}
                >➡️</button>

                <button 
                    className={styles.upLeft}
                    onPointerDown={() => handlePress(['w', 'a'])}
                    onPointerUp={() => handleRelease(['w', 'a'])}
                    onPointerLeave={() => handleRelease(['w', 'a'])}
                >↖️</button>
                
                <button 
                    className={styles.downLeft}
                    onPointerDown={() => handlePress(['s', 'a'])}
                    onPointerUp={() => handleRelease(['s', 'a'])}
                    onPointerLeave={() => handleRelease(['s', 'a'])}
                >↙️</button>
                
                <button 
                    className={styles.downRight}
                    onPointerDown={() => handlePress(['s', 'd'])}
                    onPointerUp={() => handleRelease(['s', 'd'])}
                    onPointerLeave={() => handleRelease(['s', 'd'])}
                >↘️</button>
                
                <button 
                    className={styles.upRight}
                    onPointerDown={() => handlePress(['w', 'd'])}
                    onPointerUp={() => handleRelease(['w', 'd'])}
                    onPointerLeave={() => handleRelease(['w', 'd'])}
                >↗️</button>
            </div>

            <button className={styles.actionButton}>⏺️</button>
        </div>
    )
}