import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { useInventory } from "../../Contexts/InventoryContext"
import styles from "./InventoryBar.module.css"

export const InventoryBar = () => {
    const { slots } = useInventory();
    const { inventorySize } = useGameSettings();

    return (
        <div className={styles.bar}
            style={{ gridTemplateColumns: `repeat(${inventorySize}, 4rem)` }}>
            {slots.map(slot => {
                const hasItem = !!slot.asset;

                return (
                    <div key={slot.slotIndex} className={styles.slot}>
                        {hasItem && slot.asset && (
                            <img 
                                src={slot.asset.imageUrl}
                                alt={slot.asset.name}
                            />
                        )}

                        {hasItem && slot.asset && (
                            <span className={styles.badge}>
                                {slot.amount}
                            </span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}