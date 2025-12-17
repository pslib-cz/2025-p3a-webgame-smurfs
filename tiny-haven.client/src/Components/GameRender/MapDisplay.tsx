import { Suspense } from "react";
import styles from "./MapDisplay.module.css"
import ErrorFallback from "./FetchFallback"
import { ErrorBoundary } from 'react-error-boundary';
import { TileMap } from "./TileMap";

export const MapDisplay = () => {
    return (
        <div className={styles.mapDisplay}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<p>Loading...</p>}>
                    <TileMap/>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}