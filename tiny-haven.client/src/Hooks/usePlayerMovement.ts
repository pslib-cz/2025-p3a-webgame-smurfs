import { useState, useEffect } from 'react';
import type { FacingDirection } from '../Types/player-data'
import { usePlayerLocation } from '../Contexts/PlayerLocationContext';
import { useGameSettings } from "../Contexts/GameSettingsContext"
import { useControls } from '../Contexts/ControlsContext';

export const usePlayerMovement = (
    collisionMap: boolean[][],
    maxColumns: number,
    maxRows: number
) => {
    const { location, setLocation } = usePlayerLocation();
    const { heldKeys } = useControls();
    const [ facing, setFacing ] = useState<FacingDirection>('right');
    const { stepTime } = useGameSettings();

    // Helper function to check if a tile is in the restricted area
    const isRestrictedTile = (x: number, y: number): boolean => {
        return x >= 30 && x <= 33 && y >= 92 && y <= 93;
    };

    useEffect(() => {
        const moveInterval = setInterval(() => {
            const keys = heldKeys.current; 
            let dx = 0;
            let dy = 0;

            if (keys.a) { dx -= 1; setFacing('left'); }
            else if (keys.d) { dx += 1; setFacing('right'); }
            
            if (keys.w) dy -= 1; 
            else if (keys.s) dy += 1; 

            if (dx === 0 && dy === 0) return;

            setLocation((prev) => {
                const nx = prev.x + dx;
                const ny = prev.y + dy;

                if (nx < 1 || ny < 1 || nx > maxColumns || ny > maxRows) return prev;
                if (collisionMap[ny - 1]?.[nx - 1]) return prev;
                if (isRestrictedTile(nx, ny)) return prev; // Check restricted tiles

                return { x: nx, y: ny };
            });
        }, stepTime);

        return () => clearInterval(moveInterval);
    }, [collisionMap, maxColumns, maxRows, setLocation, stepTime, heldKeys]); 

    return { location, facing };
};