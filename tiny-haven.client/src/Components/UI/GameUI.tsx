import { useGameSettings } from "../../Contexts/GameSettingsContext";
import { TileMap } from "../GameRender/TileMap";
import { BalanceDisplay } from "./BalanceDisplay/BalanceDisplay";
import { CoordinatesDisplay } from "./CoordinatesDisplay/CoordinatesDisplay";
import { InventoryBar } from "./InventoryBar/InventoryBar";
import { MobileControls } from "./MobileControls/MobileControls";

export const GameUI = () => {
    const { showControls } = useGameSettings(); 

    return (
        <>
            
            <TileMap />
            <InventoryBar />
            <BalanceDisplay />
            <CoordinatesDisplay />
            
            {showControls && <MobileControls />}
        </>
    );
};