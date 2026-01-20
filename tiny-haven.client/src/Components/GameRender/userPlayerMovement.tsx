import { useState } from "react";
import type { InteractionTile } from "./interaction.ts";

export const usePlayerMovement = (
    start: { x: number; y: number },
    collisionMap: boolean[][],
    interactionMap: (InteractionTile | null)[][],
    onPickup: (tile: InteractionTile, x: number, y: number) => void,
    gridColumns: number,
    gridRows: number
) => {
    const [location, setLocation] = useState(start);
    const [facing, setFacing] =
        useState<"up" | "down" | "left" | "right">("down");

    const tryMove = (dx: number, dy: number, dir: typeof facing) => {
        setFacing(dir);

        const nextX = location.x + dx;
        const nextY = location.y + dy;

        // 🔹 přepočet na 0-based pro mapy
        const mapX = nextX - 1;
        const mapY = nextY - 1;

        if (
            mapX < 0 ||
            mapY < 0 ||
            mapX >= gridColumns ||
            mapY >= gridRows
        ) return;

        // 1️⃣ Kolize
        if (collisionMap[mapY][mapX]) return;

        // 2️⃣ Interakce
        const interaction = interactionMap[mapY][mapX];
        if (interaction?.pickupable) {
            onPickup(interaction, mapX, mapY);
        }

        // 3️⃣ Pohyb
        setLocation({ x: nextX, y: nextY });
    };

    return {
        location,
        facing,
        moveUp: () => tryMove(0, -1, "up"),
        moveDown: () => tryMove(0, 1, "down"),
        moveLeft: () => tryMove(-1, 0, "left"),
        moveRight: () => tryMove(1, 0, "right")
    };
};
