import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { useInventory } from "../../Contexts/InventoryContext"
import type { AssetInventory } from "../../Types/player-data";
import styles from "./InventoryBar.module.css"

export const InventoryBar = () => {
    const { slots } = useInventory();
    const { inventorySize } = useGameSettings();

    const inventory = useInventory();
    
    const testItem: AssetInventory = {
        assetId: 1,
        imageUrl: "images/game_assets/ui/berry.svg",
        name: "Smurf berry"
    }

    const testStone: AssetInventory = {
        assetId: 2,
        imageUrl: "images/game_assets/nature/stone.svg",
        name: "Stone"
    }

    const handleAdd = () => {
        inventory.addItemToInventory(testItem)
    }

    const handleRemove = () => {
        inventory.removeItemFromInventory(1)
    }

    const handleAddStone = () => {
        inventory.addItemToInventory(testStone)
    }

    const handleRemoveStone = () => {
        inventory.removeItemFromInventory(2)
    }

    return (
        <div className={styles.bar}
            style={{ gridTemplateColumns: `repeat(${inventorySize}, 4rem)` }}>

            <div className={styles.slot}>
                <button onClick={handleAdd}>Přidat borůvku</button>
            </div>
            <div className={styles.slot}>
                <button onClick={handleRemove}>Odebrat borůvku</button>
            </div>
            <div className={styles.slot}>
                <button onClick={handleAddStone}>Přidat kámen</button>
            </div>
            <div className={styles.slot}>
                <button onClick={handleRemoveStone}>Odebrat kámen</button>
            </div>

            {slots.map(slot => {
                const hasItem = !!slot.asset;

                return (
                    <div key={slot.slotIndex} className={styles.slot}>
                        {/* <span className={styles.badge}>
                            9
                        </span> */}

                        {hasItem && slot.asset && (
                            <img 
                                src={slot.asset.imageUrl}
                                alt={slot.asset.name}
                            />
                        )}

                        {hasItem && slot.asset && slot.amount > 1 && (
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