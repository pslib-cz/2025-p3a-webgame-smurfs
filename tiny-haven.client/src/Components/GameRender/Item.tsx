import type { RenderableItem } from "../../Types/database-types";
import style from "./Item.module.css"

type ItemProps = {
    data: RenderableItem;
}

export const Item: React.FC<ItemProps> = ({ data }) => {
    
    return (
        <figure 
            className={style.entity}
            style={{
                gridColumn: `${data.x} / span ${data.spanX}`,
                gridRow: `${data.y} / span ${data.spanY}`
            }}>
                <img src={data.imageUrl ?? "images/game_assets/placeholder-image.svg"} alt={data.name} loading="lazy"/>
        </figure>
    )
}