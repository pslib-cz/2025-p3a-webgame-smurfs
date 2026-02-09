import { useState, useEffect, useRef, useCallback } from 'react';
import type { FacingDirection } from '../Types/player-data';
import { usePlayerLocation } from '../Contexts/PlayerLocationContext';
import { useGameSettings } from "../Contexts/GameSettingsContext";
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
    
    const moveInterval = useRef<number | null>(null);

    const isRestrictedTile = (x: number, y: number): boolean => {
        return x >= 30 && x <= 33 && y >= 92 && y <= 93;
    };

    const move = useCallback(() => {
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
            if (isRestrictedTile(nx, ny)) return prev;

            return { x: nx, y: ny };
        });
    }, [collisionMap, maxColumns, maxRows, setLocation, heldKeys])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key.toLowerCase())) return;

            if (moveInterval.current === null) {
                move();
                moveInterval.current = window.setInterval(move, stepTime);
            }
        };

        const handleKeyUp = () => {
            setTimeout(() => {
                const keys = heldKeys.current;
                const isStillMoving = keys.w || keys.a || keys.s || keys.d;

                if (!isStillMoving && moveInterval.current !== null) {
                    window.clearInterval(moveInterval.current);
                    moveInterval.current = null;
                }
            }, 10);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (moveInterval.current !== null) {
                window.clearInterval(moveInterval.current);
            }
        };
    }, [move, stepTime, heldKeys]);

    return { location, facing };
};