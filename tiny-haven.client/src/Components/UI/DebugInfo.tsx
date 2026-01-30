import { useInventory } from "../../Contexts/InventoryContext";
import { usePlayerBalance } from "../../Contexts/PlayerBalanceContext";
import { usePlayerLocation } from "../../Contexts/PlayerLocationContext"
import { useRandomItems } from "../../Contexts/RandomItemsContext";
import type { AssetInventory } from "../../Types/player-data";
 
import { use } from "react";
import { materialMapPromise } from "../../api/gameResources";

export const DebugInfo = () => {
    // 1. Fetch Grid Data directly here
    // This will suspend (wait) until the data is ready
    const grid = use(materialMapPromise) as number[][];

    const { location } = usePlayerLocation();
    const { addItemToInventory, removeItemFromInventory } = useInventory();
    const { addToBalance, subtractFromBalance } = usePlayerBalance();
    const { spawnItems } = useRandomItems();

    // 2. Calculate the ID
    // We subtract 1 because game coords are usually 1-based, but arrays are 0-based.
    // The ?. checks prevent crashes if you walk out of bounds.
    const currentTileId = grid[location.x - 1]?.[location.y - 1] ?? 0;

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
        assetId: 8,
        imageUrl: "/images/game_assets/nature/stone.svg",
        name: "Stone"
    }

    return (
        <div style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 9999 // Ensure it stays on top
        }}>
            <p style={{
                fontSize: "1.2rem",
                color: "#FFFFFF",
                margin: "0",
                background: "rgba(0, 0, 0, 0.6)",
                padding: "8px",
                borderRadius: "6px",
                pointerEvents: "none" // Lets clicks pass through the text
            }}>
                X: {location.x} <br />
                Y: {location.y} <br />
                Tile ID: <strong>{currentTileId}</strong>
            </p>

            <div style={{
                display: "flex",
                marginTop: "10px",
                gap: "5px",
                flexWrap: "wrap"
            }}>
                <button onClick={() => addItemToInventory(Berry)}>+ Berry</button>
                <button onClick={() => addItemToInventory(Wood)}>+ Wood</button>
                <button onClick={() => addItemToInventory(Stone)}>+ Stone</button>
            </div>

            <div style={{
                display: "flex",
                marginTop: "5px",
                gap: "5px",
                flexWrap: "wrap"
            }}>
                <button onClick={() => removeItemFromInventory(1)}>- Berry</button>
                <button onClick={() => removeItemFromInventory(9)}>- Wood</button>
                <button onClick={() => removeItemFromInventory(8)}>- Stone</button>
            </div>

            <div style={{
                display: "flex",
                marginTop: "10px",
                gap: "5px"
            }}>
                <button onClick={() => addToBalance(100)}>+ 100</button>
                <button onClick={() => addToBalance(10000)}>+ 10k</button>
                <button onClick={() => subtractFromBalance(100)}>- 100</button>
                <button onClick={() => subtractFromBalance(10000)}>- 10k</button>
            </div>

            <div style={{
                display: "flex",
                marginTop: "10px",
                gap: "5px"
            }}>
                <button onClick={() => spawnItems(4)}>Spawn Berries</button>
                <button onClick={() => spawnItems(9)}>Spawn Wood</button>
                <button onClick={() => spawnItems(8)}>Spawn Stone</button>
                <button onClick={() => spawnItems(14)}>Spawn Tulips</button>
            </div>
        </div>
    )
}