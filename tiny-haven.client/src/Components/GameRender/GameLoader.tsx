import { useEffect, useRef, useState } from 'react';
import { useRandomItems } from '../../Contexts/RandomItemsContext';
import { SuspenseFallback } from '../Fallback/SuspenseFallback';

const INITIAL_SPAWN_LIST = [ 9, 8, 4, 14, 15, 16 ]

const GameLoader = () => {
    const { spawnItems } = useRandomItems();
    const [status, setStatus] = useState("Initializing World...");
    const [isComplete, setIsComplete] = useState(false);

    const hasInitilized = useRef(false);

    useEffect(() => {
        if (hasInitilized.current) return;

        hasInitilized.current = true;

        const initWorld = async () => {
            if (isComplete) return;

            for (const itemId of INITIAL_SPAWN_LIST) {
                await spawnItems(itemId);
            }

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