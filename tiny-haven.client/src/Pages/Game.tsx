import { Suspense } from "react";
import styles from "./Game.module.css"
import ErrorFallback from "../Components/GameRender/FetchFallback"
import { ErrorBoundary } from 'react-error-boundary';
import { TileMap } from "../Components/GameRender/TileMap";
import { GameSettingsProvider } from "../Contexts/GameSettingsContext";
import { InventoryProvider } from "../Contexts/InventoryContext";
import { InventoryBar } from "../Components/UI/InventoryBar";
import { PlayerBalanceProvider } from "../Contexts/PlayerBalanceContext";
import { BalanceDisplay } from "../Components/UI/BalanceDisplay";
import { PlayerLocationProvider } from "../Contexts/PlayerLocationContext";
import { DebugInfo } from "../Components/UI/DebugInfo";

export const MapDisplay = () => {
    return (
        <div className={styles.mapDisplay}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<p>Loading configuration...</p>}>
                    <GameSettingsProvider>
                        <PlayerLocationProvider>
                            <PlayerBalanceProvider>
                                <InventoryProvider>

                                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                                        <Suspense fallback={<p>Loading...</p>}>
                                            <TileMap/>
                                            <InventoryBar/>
                                            <BalanceDisplay/>
                                            <DebugInfo/>
                                        </Suspense>
                                    </ErrorBoundary>

                                </InventoryProvider>
                            </PlayerBalanceProvider>
                        </PlayerLocationProvider>
                    </GameSettingsProvider>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}