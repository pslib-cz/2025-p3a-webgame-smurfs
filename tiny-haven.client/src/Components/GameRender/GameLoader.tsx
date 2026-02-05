import { useEffect, useRef, useState } from 'react';
import { useRandomItems } from '../../Contexts/RandomItemsContext';
import { SuspenseFallback } from '../Fallback/SuspenseFallback';

const GameLoader = () => {
    const { requestAllItems } = useRandomItems();
    
    const [status, setStatus] = useState("Initializing World...");
    const [isComplete, setIsComplete] = useState(false);

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;

        hasInitialized.current = true;

        const initWorld = async () => {
            if (isComplete) return;

            await requestAllItems();

            setStatus("World Ready!");
            setTimeout(() => setIsComplete(true), 500);
        };

        initWorld();
    }, []);

    if (isComplete) return null;

    return (
        <SuspenseFallback message={status}/>
    );
};

export default GameLoader;