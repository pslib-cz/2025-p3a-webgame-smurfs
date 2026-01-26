import { useState, useEffect, useRef } from 'react';
import type { FacingDirection } from '../Types/player-data'
import { usePlayerLocation } from '../Contexts/PlayerLocationContext';

const STEP_TIME = 200;

export const usePlayerMovement = (
    collisionMap: boolean[][],
    maxColumns: number,
    maxRows: number
) => {
    const { location, setLocation } = usePlayerLocation();
    const [ facing, setFacing ] = useState<FacingDirection>('right');
    
    const keys = useRef({ w: false, a: false, s: false, d: false });

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "w") keys.current.w = true;
            if (e.key === "a") keys.current.a = true;
            if (e.key === "s") keys.current.s = true;
            if (e.key === "d") keys.current.d = true;
        };
        const up = (e: KeyboardEvent) => {
            if (e.key === "w") keys.current.w = false;
            if (e.key === "a") keys.current.a = false;
            if (e.key === "s") keys.current.s = false;
            if (e.key === "d") keys.current.d = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    // Game Loop
    useEffect(() => {
        const moveInterval = setInterval(() => {
            let dx = 0;
            let dy = 0;

            // Logika pro směr (Facing)
            if (keys.current.a) { dx -= 1; setFacing('left'); }
            if (keys.current.d) { dx += 1; setFacing('right'); }
            if (keys.current.w) dy -= 1;
            if (keys.current.s) dy += 1;

            if (dx === 0 && dy === 0) return;

            setLocation((prev) => {
                const nx: number = prev.x + dx;
                const ny: number = prev.y + dy;

                // Hranice mapy
                if (nx < 1 || ny < 1 || nx > maxColumns || ny > maxRows) return prev;

                // Kolize
                if (collisionMap[ny - 1]?.[nx - 1]) return prev;

                return { x: nx, y: ny };
            });
        }, STEP_TIME);

        return () => clearInterval(moveInterval);
    }, [collisionMap, maxColumns, maxRows, setLocation]);

    return { location, facing };
};