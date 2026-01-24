import { Suspense } from "react";
import styles from "./MapDisplay.module.css"
import ErrorFallback from "./FetchFallback"
import { ErrorBoundary } from 'react-error-boundary';
import { TileMap } from "./TileMap";
import { GameSettingsProvider } from "../../Contexts/GameSettingsContext";
import { InventoryProvider } from "../../Contexts/InventoryContext";
import { InventoryBar } from "../UI/InventoryBar";
import { PlayerBalanceProvider } from "../../Contexts/PlayerBalanceContext";
import { BalanceDisplay } from "../UI/BalanceDisplay";

export const MapDisplay = () => {
    return (
        <div className={styles.mapDisplay}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<p>Loading configuration...</p>}>
                    <GameSettingsProvider>

                        <PlayerBalanceProvider>

                            <InventoryProvider>

                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                    <Suspense fallback={<p>Loading...</p>}>
                                        <TileMap/>
                                        <InventoryBar/>
                                        <BalanceDisplay/>
                                    </Suspense>
                                </ErrorBoundary>

                            </InventoryProvider>

                        </PlayerBalanceProvider>

                    </GameSettingsProvider>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}