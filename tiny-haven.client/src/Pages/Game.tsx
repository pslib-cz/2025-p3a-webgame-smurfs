import { Suspense } from "react";
import styles from "./Game.module.css"
import ErrorFallback from "../Components/Fallback/FetchFallback"
import { ErrorBoundary } from 'react-error-boundary';
import { GameSettingsProvider } from "../Contexts/GameSettingsContext";
import { InventoryProvider } from "../Contexts/InventoryContext";
import { PlayerBalanceProvider } from "../Contexts/PlayerBalanceContext";
import { PlayerLocationProvider } from "../Contexts/PlayerLocationContext";
// import { DebugInfo } from "../Components/UI/DebugInfo";
import { InteractionProvider } from "../Contexts/InteractionContext";
import { InteractionButton } from "../Components/UI/InteractionButton"
import { RandomItemProvider } from "../Contexts/RandomItemsContext";
import GameLoader from "../Components/GameRender/GameLoader";
import { SuspenseFallback } from "../Components/Fallback/SuspenseFallback";
import { InteractionMapProvider } from "../Contexts/InteractionMapContext";
import { QuestProvider } from "../Contexts/QuestContext";
import { ActiveQuest } from "../Components/UI/ActiveQuest";
import { HandyQuestDisplay } from "../Components/UI/HandyQuestDisplay";

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
                                        <QuestProvider>
                                            <PlayerLocationProvider>
                                                <PlayerBalanceProvider>
                                                    
                                                        <InventoryProvider>

                                        <PlayerLocationProvider>
                                            <ControlsProvider>
                                                <PlayerBalanceProvider>
                                                    <InventoryProvider>

                                                        <InteractionProvider>

                                                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                                                <Suspense fallback={<SuspenseFallback message="Loading assets..." />}>
                                                                    <GameLoader/>
                                                                    <GameUI/>
                                                                </Suspense>
                                                            </ErrorBoundary>

                                                            <InteractionButton />

                                                        </InteractionProvider>

                                                    </InventoryProvider>
                                                </PlayerBalanceProvider>
                                            </ControlsProvider>
                                        </PlayerLocationProvider>
                                                            <InteractionProvider>

                                                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                                                    <Suspense fallback={<SuspenseFallback message="Loading assets..." />}>
                                                                        <GameLoader/>
                                                                        <TileMap/>
                                                                        <InventoryBar/>
                                                                        <BalanceDisplay/>
                                                                        <DebugInfo/>
                                                                        <ActiveQuest />
                                                                        <HandyQuestDisplay />
                                                                    </Suspense>
                                                                </ErrorBoundary>

                                                                <InteractionButton />

                                                            </InteractionProvider>

                                                        </InventoryProvider>
                                                        
                                                </PlayerBalanceProvider>
                                            </PlayerLocationProvider>
                                        </QuestProvider>
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