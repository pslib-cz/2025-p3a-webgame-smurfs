import { createContext, use, useContext } from "react";
import type { GameConfigDTO } from "../Types/database-types";
import { configPromise } from "../api/gameResources";

const GameSettingsContext = createContext<GameConfigDTO | null>(null);

export const GameSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const config = use(configPromise);

    return (
        <GameSettingsContext.Provider value={config}>
            {children}
        </GameSettingsContext.Provider>
    );
};

export const useGameSettings = () => {
    const ctx = useContext(GameSettingsContext);
    if (!ctx) throw new Error("useGameSettings must be used within Provider");
    return ctx;
};