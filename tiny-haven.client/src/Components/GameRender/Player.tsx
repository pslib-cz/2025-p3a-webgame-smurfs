import { useGameSettings } from "../../Contexts/GameSettingsContext";
import type { AssetDTO } from "../../Types/database-types";
import type { FacingDirection, PlayerLocation } from "../../Types/player-data"
import style from "./Player.module.css"

type PlayerProps = {
    data: AssetDTO;
    location: PlayerLocation;
    facing: FacingDirection;
}

export const Player: React.FC<PlayerProps> = ({ data, location, facing }) => {
    const { stepTime } = useGameSettings();

    const pixelX = (location.x - 1) * 16;
    const pixelY = (location.y - 1) * 16;

    const width = (data.spanX ?? 1) * 16;
    const height = (data.spanY ?? 1) * 16;

    return (
        <figure 
            className={style.player}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate3d(${pixelX}px, ${pixelY}px, 0)`,
                transition: `transform ${stepTime}ms linear`
            }}>
                <img src={data.imageUrl ?? "images/placeholder-image.svg"} alt={data.name} 
                    style={{
                        transform: `scaleX(${facing === 'left' ? -1 : 1})`,
                    }}/>
        </figure>
    )
}