import { usePlayerLocation } from "../../Contexts/PlayerLocationContext";
import styles from "./CoordinatesDisplay.module.css"

export const CoordinatesDisplay = () => {
    const { location } = usePlayerLocation();

    return (
        <div className={styles.display}>
            <p>X: {location.x}</p>
            <p>Y: {location.y}</p>
        </div>
    )
}