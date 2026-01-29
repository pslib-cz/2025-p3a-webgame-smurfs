import { useEffect, useState } from 'react';
import { useGenerateItems } from '../../Contexts/RandomItemsContext';
import { SuspenseFallback } from '../Fallback/SuspenseFallback';

const INITIAL_SPAWN_LIST = [ 9, 8, 4 ]

const GameLoader = () => {
    const { spawnItems } = useGenerateItems();
    const [status, setStatus] = useState("Initializing World...");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
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