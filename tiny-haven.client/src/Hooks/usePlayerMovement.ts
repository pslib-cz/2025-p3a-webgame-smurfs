import { useState, useEffect, useRef } from 'react';
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

    const lastMoveTime = useRef<number>(0);

    const isRestrictedTile = (x: number, y: number): boolean => {
        return x >= 30 && x <= 33 && y >= 92 && y <= 93;
    };

    useEffect(() => {
        let animationFrameId: number;

        const update = (currentTime: number) => {
            const keys = heldKeys.current;
            const isMoving = keys.w || keys.a || keys.s || keys.d;

            if (!isMoving) {
                lastMoveTime.current = 0;
            } else {
                if (currentTime - lastMoveTime.current >= stepTime) {
                    let dx = 0;
                    let dy = 0;

                    if (keys.a) { dx -= 1; setFacing('left'); }
                    else if (keys.d) { dx += 1; setFacing('right'); }
                    
                    if (keys.w) dy -= 1; 
                    else if (keys.s) dy += 1; 

                    if (dx !== 0 || dy !== 0) {
                        setLocation((prev) => {
                            const nx = prev.x + dx;
                            const ny = prev.y + dy;

                            if (nx < 1 || ny < 1 || nx > maxColumns || ny > maxRows) return prev;
                            if (collisionMap[ny - 1]?.[nx - 1]) return prev;
                            if (isRestrictedTile(nx, ny)) return prev;

                            return { x: nx, y: ny };
                        });

                        lastMoveTime.current = currentTime;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationFrameId);
    }, [collisionMap, maxColumns, maxRows, setLocation, stepTime, heldKeys]); 

    return { location, facing };
};