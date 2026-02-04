import { createContext, use, useContext, useMemo, useState } from "react";
import type { GameConfigDTO } from "../Types/database-types";
import { configPromise } from "../api/gameResources";
import { useDeviceDetection } from "../Hooks/useDeviceDetection"

const STORAGE_KEY = 'SHOW_MOBILE_CONTROLS';

interface GameContextValue {
    config: GameConfigDTO;
    stepTime: number;
    showControls: boolean;
    setShowControls: (show: boolean) => void;
}

const GameSettingsContext = createContext<GameContextValue | null>(null);

export const GameSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const config = use(configPromise);
    const isMobileDetected = useDeviceDetection();

    const stepTime = 200;

    const [userOverride, setUserOverride] = useState<boolean | null>(() => {
        if (typeof window === "undefined") return null;
        
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'true') return true;
        if (saved === 'false') return false;
        return null;
    });

    const showControls = useMemo(() => {
        return userOverride !== null ? userOverride : isMobileDetected;
    }, [userOverride, isMobileDetected]);

    const setShowControls = (show: boolean) => {
        setUserOverride(show);
        localStorage.setItem(STORAGE_KEY, String(show));
    };

    return (
        <GameSettingsContext.Provider value={{ config, showControls, setShowControls, stepTime }}>
            {children}
        </GameSettingsContext.Provider>
    );
};

export const useGameSettings = () => {
    const ctx = useContext(GameSettingsContext);
    if (!ctx) throw new Error("useGameSettings must be used within Provider");
    return ctx;
};