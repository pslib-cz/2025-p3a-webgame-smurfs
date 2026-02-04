import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

export type ControlKey = 'w' | 'a' | 's' | 'd' | 'e';

interface ControlsContextType {
    controls: Record<ControlKey, boolean>;
    heldKeys: React.RefObject<Record<ControlKey, boolean>>; 
    setControl: (key: ControlKey, isPressed: boolean) => void;
}

const ControlsContext = createContext<ControlsContextType | null>(null);

export const ControlsProvider = ({ children }: { children: React.ReactNode }) => {
    const [controls, setControlsState] = useState<Record<ControlKey, boolean>>({
        w: false, a: false, s: false, d: false, e: false
    });

    const heldKeys = useRef<Record<ControlKey, boolean>>({
        w: false, a: false, s: false, d: false, e: false
    });

    const setControl = (key: ControlKey, isPressed: boolean) => {
        if (heldKeys.current) {
            heldKeys.current[key] = isPressed;
        }

        setControlsState(prev => {
            if (prev[key] === isPressed) return prev;
            return { ...prev, [key]: isPressed };
        });
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
            const key = e.key.toLowerCase() as ControlKey;
            if (['w', 'a', 's', 'd', 'e'].includes(key)) {
                setControl(key, isPressed);
            }
        };

        const down = (e: KeyboardEvent) => handleKey(e, true);
        const up = (e: KeyboardEvent) => handleKey(e, false);

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, []);

    return (
        <ControlsContext.Provider value={{ controls, heldKeys, setControl }}>
            {children}
        </ControlsContext.Provider>
    );
};

export const useControls = () => {
    const context = useContext(ControlsContext);
    if (!context) throw new Error("useControls must be used within ControlsProvider");
    return context;
};