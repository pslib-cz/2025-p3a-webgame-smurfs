import { usePlayerLocation } from "../../../Contexts/PlayerLocationContext";
import styles from "./MapModal.module.css"
import "../../../styles/globals.css"

type MapModalProps = {
    setMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MapModal: React.FC<MapModalProps> = ({ setMapOpen }) => {
    const { location } = usePlayerLocation();

    function handleClick() {
        setMapOpen((prev) => !prev)
    }

    return (
        <div className={styles.mapModal}>
            <button className={styles.mapModal__btn} onClick={handleClick}>
                <img src="images/game_assets/ui/x-mark.svg" alt="Zavřít" />
            </button>

            <div className={styles.mapModal__map}>
                <div className={styles.playerIndicator} 
                style={{
                    gridColumn: location.x,
                    gridRow: location.y
                }}>
                    <img src="images/game_assets/ui/head.svg" alt="Lokátor hráče" />
                </div>
            </div>
        </div>
    )
}