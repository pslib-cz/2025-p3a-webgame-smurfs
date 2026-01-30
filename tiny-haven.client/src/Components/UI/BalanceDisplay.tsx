import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import "../../styles/globals.css"
import styles from "./BalanceDisplay.module.css";

export const BalanceDisplay = () => {
    const { formattedBalance } = usePlayerBalance();

    return (
        <div className={styles.display} title={`You have ${formattedBalance} berries`}>
            <img src="/images/game_assets/ui/berry.svg" alt="Smurf berry" />
            <p>
                {formattedBalance}
            </p>
        </div>
    )
}