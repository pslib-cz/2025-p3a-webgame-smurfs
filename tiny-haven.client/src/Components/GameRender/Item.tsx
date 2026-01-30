import { memo } from "react";
import type { RenderableItem } from "../../Types/database-types";
import style from "./Item.module.css"

type ItemProps = {
    data: RenderableItem;
}

export const Item = memo(({ data }: ItemProps) => {
    
    return (
        <div 
            className={style.entity}
            style={{
                gridColumn: `${data.x} / span ${data.spanX}`,
                gridRow: `${data.y} / span ${data.spanY}`
            }}>
                <img src={data.imageUrl ?? "images/game_assets/placeholder-image.svg"} alt={data.name} loading="lazy"/>
        </div>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.data.id === nextProps.data.id &&
        prevProps.data.x === nextProps.data.x &&
        prevProps.data.y === nextProps.data.y
    );
});