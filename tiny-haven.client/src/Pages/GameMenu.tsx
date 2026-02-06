import styles from "./GameMenu.module.css"

export const GameMenu = () => {

    return (
        <div className={styles.page}>
            <div>
                <img className={styles.headimage} src="images/game_assets/ui/head" alt="hlava" />
                <h1>Tiny Haven</h1>
            </div>
            <button>Začít hru</button>
        </div>
    )
} 