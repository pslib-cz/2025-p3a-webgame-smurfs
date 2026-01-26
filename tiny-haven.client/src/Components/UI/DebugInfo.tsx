import { useInventory } from "../../Contexts/InventoryContext";
import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import { usePlayerLocation } from "../../Contexts/PlayerLocationContext"
import type { AssetInventory } from "../../Types/player-data";
 
export const DebugInfo = () => {
    const { location } = usePlayerLocation();
    const { addItemToInventory, removeItemFromInventory } = useInventory();
    const { addToBalance, subtractFromBalance } = usePlayerBalance();

    const Berry: AssetInventory = {
        assetId: 1,
        imageUrl: "/images/game_assets/ui/berry.svg",
        name: "Smurf berry"
    }

    const Wood: AssetInventory = {
        assetId: 9,
        imageUrl: "/images/game_assets/nature/wood.svg",
        name: "Wood"
    }

    const Stone: AssetInventory = {
        assetId: 3,
        imageUrl: "/images/game_assets/nature/stone.svg",
        name: "Stone"
    }

    return (
        <div style={{
            position: "absolute",
            top: "1rem",
            left: "1rem"
        }}>
            <p style={{
                fontSize: "1.2rem",
                color: "#FFFFFF",
                margin: "0"
            }}>X: {location.x}<br/> Y: {location.y}</p>

            <div style={{
                display: "flex"
            }}>
                <button onClick={() => addItemToInventory(Berry)}>+ Berry</button>
                <button onClick={() => addItemToInventory(Wood)}>+ Wood</button>
                <button onClick={() => addItemToInventory(Stone)}>+ Stone</button>
                <button onClick={() => removeItemFromInventory(1)}>- Berry</button>
                <button onClick={() => removeItemFromInventory(9)}>- Wood</button>
                <button onClick={() => removeItemFromInventory(3)}>- Stone</button>
            </div>

            <div style={{
                display: "flex"
            }}>
                <button onClick={() => addToBalance(100)}>+ 100</button>
                <button onClick={() => addToBalance(10000)}>+ 10.000</button>
                <button onClick={() => subtractFromBalance(100)}>- 100</button>
                <button onClick={() => subtractFromBalance(10000)}>- 10.000</button>
            </div>
        </div>
    )
}