import type { AssetDTO } from "../../Types/database-types";
import type { PlayerLocation } from "../../Types/player-data"
import style from "./Player.module.css"

type PlayerProps = {
    data: AssetDTO;
    location: PlayerLocation;
}

export const Player: React.FC<PlayerProps> = ({ data, location }) => {

    // const moveRight = () => {
    //     // 2. Use functional update to access 'prev' state
    //     setPlayer(prev => ({
    //     ...prev,     // Keep 'y' exactly as it was
    //     x: prev.x + 10 
    //     }));
    // };

    // const moveUp = () => {
    //     setPlayer(prev => ({
    //     ...prev,     // Keep 'x' exactly as it was
    //     y: prev.y + 10 
    //     }));
    // };

    return (
        <figure 
            className={style.player}
            style={{
                gridColumn: `${location.x} / span ${data.spanX}`,
                gridRow: `${location.y} / span ${data.spanY}`
            }}>
                <img src={data.imageUrl ?? "images/placeholder-image.svg"} alt={data.name} />
        </figure>
    )
}