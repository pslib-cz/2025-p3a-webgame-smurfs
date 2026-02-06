import styles from "./GameMenu.module.css"
import { useNavigate } from "react-router-dom";

export const GameMenu = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.gameTitle}>
                <img className={styles.headimage} src="images/game_assets/ui/head.svg" alt="hlava" />
                <h1>Tiny Haven</h1>
            </div>
            <button onClick={() => navigate("/play")}>Spustit hru</button>
        </div>
    )
} 