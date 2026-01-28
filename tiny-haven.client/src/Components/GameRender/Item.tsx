import type { AssetDTO } from "../../Types/database-types";
import style from "./Item.module.css"

type ItemProps = {
    id: number;
    x: number;
    y: number;
    assets: AssetDTO[];
}

export const Item: React.FC<ItemProps> = ({ id, x, y, assets }) => {
    const asset = assets.find(a => a.assetId == id)
    
    return (
        <figure 
            className={style.entity}
            style={{
                gridColumn: `${x} / span ${asset?.spanX}`,
                gridRow: `${y} / span ${asset?.spanY}`
            }}>
                <img src={asset?.imageUrl ?? "images/placeholder-image.svg"} alt={asset?.name} loading="lazy"/>
        </figure>
    )
}