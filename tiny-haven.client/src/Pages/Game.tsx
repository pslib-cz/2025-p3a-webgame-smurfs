import { Suspense } from "react";
import styles from "./Game.module.css"
import ErrorFallback from "../Components/Fallback/FetchFallback"
import { ErrorBoundary } from 'react-error-boundary';
import { TileMap } from "../Components/GameRender/TileMap";
import { GameSettingsProvider } from "../Contexts/GameSettingsContext";
import { InventoryProvider } from "../Contexts/InventoryContext";
import { InventoryBar } from "../Components/UI/InventoryBar/InventoryBar";
import { PlayerBalanceProvider } from "../Contexts/PlayerBalanceContext";
import { BalanceDisplay } from "../Components/UI/BalanceDisplay/BalanceDisplay";
import { PlayerLocationProvider } from "../Contexts/PlayerLocationContext";
// import { DebugInfo } from "../Components/UI/DebugInfo";
import { InteractionProvider } from "../Contexts/InteractionContext";
import { InteractionButton } from "../Components/UI/InteractionButton"
import { RandomItemProvider } from "../Contexts/RandomItemsContext";
import GameLoader from "../Components/GameRender/GameLoader";
import { SuspenseFallback } from "../Components/Fallback/SuspenseFallback";
import { InteractionMapProvider } from "../Contexts/InteractionMapContext";
import { CoordinatesDisplay } from "../Components/UI/CoordinatesDisplay/CoordinatesDisplay";
import { MobileControls } from "../Components/UI/MobileControls/MobileControls";

export const MapDisplay = () => {
    return (
        <div className={styles.mapDisplay}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<SuspenseFallback message="Loading configuration..." />}>
                    <GameSettingsProvider>
                        <RandomItemProvider>

                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Suspense fallback={<SuspenseFallback message="Loading interactions..."/>}>
                                    <InteractionMapProvider>

                                        <PlayerLocationProvider>
                                            <PlayerBalanceProvider>
                                                <InventoryProvider>

                                                    <InteractionProvider>

                                                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                                                            <Suspense fallback={<SuspenseFallback message="Loading assets..." />}>
                                                                <GameLoader/>
                                                                <TileMap/>
                                                                <InventoryBar/>
                                                                <BalanceDisplay/>
                                                                {/* <DebugInfo/> */}
                                                                <CoordinatesDisplay/>
                                                                <MobileControls/>
                                                            </Suspense>
                                                        </ErrorBoundary>

                                                        <InteractionButton />

                                                    </InteractionProvider>

                                                </InventoryProvider>
                                            </PlayerBalanceProvider>
                                        </PlayerLocationProvider>

                                    </InteractionMapProvider>
                                </Suspense>
                            </ErrorBoundary>

                        </RandomItemProvider>
                    </GameSettingsProvider>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}