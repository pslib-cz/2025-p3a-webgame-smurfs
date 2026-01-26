import { createContext, useContext, useState, useEffect } from 'react';
import { useGameSettings } from './GameSettingsContext'; 

interface PlayerBalanceContextType {
    balance: number;
    formattedBalance: string;
    addToBalance: (amount: number) => void;
    subtractFromBalance: (amount: number) => boolean;
}

const PlayerBalanceContext = createContext<PlayerBalanceContextType | null>(null);

const STORAGE_KEY = 'player_balance';

export const PlayerBalanceProvider = ({ children }: { children: React.ReactNode }) => {
    const { startingBalance } = useGameSettings();

    const [balance, setBalance] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        let initialBalance: number;

        if (saved) {
            initialBalance = JSON.parse(saved);
        } else {
            initialBalance = startingBalance ?? 0;
        }

        // Kontrola validity dat
        if (typeof initialBalance !== 'number' || isNaN(initialBalance)) {
            return startingBalance ?? 0;
        }

        return initialBalance;
    });

    // Uložení zůstatku
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(balance));
    }, [balance]);

    // addToBalance(amount)
    const addToBalance = (amount: number) => {
        setBalance((prev) => prev + amount);
    };

    // subtractFromBalance(amount)
    const subtractFromBalance = (amount: number): boolean => {
        if (balance >= amount) {
            setBalance((prev) => prev - amount);
            return true;
        }
        return false;
    };

    const formattedBalance = new Intl.NumberFormat('de-DE').format(balance);

    return (
        <PlayerBalanceContext.Provider value={{ balance, formattedBalance, addToBalance, subtractFromBalance }}>
            {children}
        </PlayerBalanceContext.Provider>
    );
};

export const usePlayerBalance = () => {
    const context = useContext(PlayerBalanceContext);
    if (!context) throw new Error("usePlayerBalance must be used within PlayerBalanceProvider");
    return context;
};