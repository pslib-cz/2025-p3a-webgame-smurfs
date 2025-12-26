import React, { useEffect, useState } from 'react';
import { type AssetDTO } from '../../Types/database-types';

export const TestDataFetcher: React.FC = () => {
    // State to store data
    const [assets, setAssets] = useState<AssetDTO[]>([]);
    
    // State for UI handling
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both endpoints in parallel
                const [assetsResponse] = await Promise.all([
                    fetch('/api/Assets')
                ]);

                if (!assetsResponse.ok) {
                    throw new Error('Failed to fetch data from server');
                }

                const assetsData = await assetsResponse.json();

                setAssets(assetsData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Data Fetcher Test</h2>

            <div style={{ display: 'flex', gap: '50px' }}>
                {/* Render Assets */}
                <div>
                    <h3>Assets List</h3>
                    {assets.length === 0 ? <p>No assets found.</p> : (
                        <ul>
                            {assets.map((asset) => (
                                <li key={asset.assetId} style={{ marginBottom: '10px' }}>
                                    <strong>ID: {asset.assetId} - {asset.name}</strong><br />
                                    <small>Span: {asset.spanX}x{asset.spanY}</small><br />
                                    <small>Image: {asset.imageUrl || 'None'}</small>
                                    <img src={asset.imageUrl ?? "/images/game_assets/placeholder-image.svg"} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};