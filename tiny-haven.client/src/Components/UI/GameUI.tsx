import { useState } from "react";
import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { TileMap } from "../GameRender/TileMap";
import { BalanceDisplay } from "./BalanceDisplay/BalanceDisplay";
import { ControlsToggle } from "./ControlsToggle/ControlsToggle";
import { CoordinatesDisplay } from "./CoordinatesDisplay/CoordinatesDisplay";
import { InventoryBar } from "./InventoryBar/InventoryBar";
import { MobileControls } from "./MobileControls/MobileControls";
import { MapToggle } from "./MapToggle/MapToggle";
import { MapModal } from "./MapModal/MapModal";
import { TutorialPopup } from "./TutorialPopup/TutorialPopup";
import { GameReset } from "./GameReset/GameReset";

export const GameUI = () => {
    const { showControls } = useGameSettings();
    const [ isMapOpen, setIsMapOpen ] = useState<boolean>(false);

    return (
        <>
            <TileMap />
            <InventoryBar />
            <BalanceDisplay />
            <CoordinatesDisplay />
            <ControlsToggle />
            <TutorialPopup />
            <GameReset />

            <MapToggle setMapOpen={setIsMapOpen} />
            {isMapOpen && <MapModal setMapOpen={setIsMapOpen}/>}
            
            {showControls && <MobileControls />}
        </>
    );
};