import styles from "./MapToggle.module.css"

type MapToggleProps = {
    setMapOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const MapToggle: React.FC<MapToggleProps> = ({ setMapOpen }) => {
    function handleClick() {
        setMapOpen((prev) => !prev)
    }

    return (
        <button className={styles.mapToggleBtn} onClick={handleClick} title="Zobrazit mapu">
            <img src="images/game_assets/ui/map_icon.svg" alt="Ikonka mapy" />
        </button>
    )
}