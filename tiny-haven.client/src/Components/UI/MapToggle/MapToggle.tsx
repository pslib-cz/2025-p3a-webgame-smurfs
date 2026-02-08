import { useEffect } from "react"
import styles from "./MapToggle.module.css"
import "../../../styles/globals.css"

type MapToggleProps = {
    setMapOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const MapToggle: React.FC<MapToggleProps> = ({ setMapOpen }) => {
    function handleClick() {
        setMapOpen((prev) => !prev)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "KeyM") {
            setMapOpen(prev => !prev);
        }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <button className={styles.mapToggleBtn} onClick={handleClick} title="Zobrazit mapu [M]">
            <img src="images/game_assets/ui/map_icon.svg" alt="Ikonka mapy" />
            <span>Minimapa [M]</span>
        </button>
    )
}