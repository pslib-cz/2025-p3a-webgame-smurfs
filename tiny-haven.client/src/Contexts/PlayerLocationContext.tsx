import { createContext, useState, useRef, useEffect, useContext } from "react";
import type { PlayerLocation } from "../Types/player-data";

interface PlayerLocationContextType {
    location: PlayerLocation;
    setLocation: React.Dispatch<React.SetStateAction<PlayerLocation>>;
}

const PlayerLocationContext = createContext<PlayerLocationContextType | null>(null);

const STORAGE_KEY = 'player_location';
const SAVE_TIMEOUT_MS = 2000;

export const PlayerLocationProvider = ({ children }: { children: React.ReactNode }) => {
    // Načtení lokace z local storage
    const [location, setLocation] = useState<PlayerLocation>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { x: 36, y: 95 };
    });

    const lastSaved = useRef<number>(Date.now());

    useEffect(() => {
        const now = Date.now();
        if (now - lastSaved.current > SAVE_TIMEOUT_MS) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
            lastSaved.current = now;
        }
    }, [location]);

    // Uložení při zavření prohlížeče
    useEffect(() => {
        const handleUnload = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [location]);

    return (
        <PlayerLocationContext.Provider value={{ location, setLocation }}>
            {children}
        </PlayerLocationContext.Provider>
    );
};

export const usePlayerLocation = () => {
    const context = useContext(PlayerLocationContext);
    if (!context) throw new Error("usePlayerLocation must be used within PlayerLocationProvider");
    return context;
};