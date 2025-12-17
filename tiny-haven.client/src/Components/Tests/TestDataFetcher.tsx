import React, { useEffect, useState } from 'react';
import { type Asset, type Category } from '../../Types/database-types';

export const TestDataFetcher: React.FC = () => {
    // State to store data
    const [assets, setAssets] = useState<Asset[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    
    // State for UI handling
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both endpoints in parallel
                const [assetsResponse, categoriesResponse] = await Promise.all([
                    fetch('/api/assets'),
                    fetch('/api/categories')
                ]);

                if (!assetsResponse.ok || !categoriesResponse.ok) {
                    throw new Error('Failed to fetch data from server');
                }

                const assetsData = await assetsResponse.json();
                const categoriesData = await categoriesResponse.json();

                setAssets(assetsData);
                setCategories(categoriesData);
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
                                    <img src={asset.imageUrl ?? "/images/placeholder-image.svg"} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Render Categories */}
                <div>
                    <h3>Categories List</h3>
                    {categories.length === 0 ? <p>No categories found.</p> : (
                        <ul>
                            {categories.map((cat) => (
                                <li key={cat.categoryId}>
                                    <strong>ID: {cat.categoryId} - {cat.name}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};