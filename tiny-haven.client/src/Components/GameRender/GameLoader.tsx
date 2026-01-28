import { useEffect, useState } from 'react';
import { useGenerateItems } from '../../Contexts/RandomItemsContext';

const INITIAL_SPAWN_LIST = [ 9, 8, 4 ]

const GameLoader = () => {
    const { spawnItems } = useGenerateItems();
    const [status, setStatus] = useState("Initializing World...");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const initWorld = async () => {
            if (isComplete) return;

            for (const itemId of INITIAL_SPAWN_LIST) {
                setStatus(`Spawning Item ID: ${itemId}...`);
                await spawnItems(itemId);
            }

            setStatus("World Ready!");
            setTimeout(() => setIsComplete(true), 500);
        };

        initWorld();
    }, []);

    if (isComplete) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#111', color: '#fff',
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', zIndex: 9999
        }}>
            {status}
        </div>
    );
};

export default GameLoader;