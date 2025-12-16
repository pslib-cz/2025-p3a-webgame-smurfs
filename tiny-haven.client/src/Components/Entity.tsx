import type { LocationMap } from "../Types/database-types"
import style from "./css/Entity.module.css"

type EntityProps = {
    data: LocationMap;
}

export const Entity: React.FC<EntityProps> = ({ data }) => {
    return (
        <figure 
            className={style.entity}
            style={{
                gridColumn: `${data.locationX} / span ${data.asset?.spanX}`,
                gridRow: `${data.locationY} / span ${data.asset?.spanY}`
            }}>
                <img src={data.asset?.imageUrl ?? "images/placeholder-image.svg"} alt={data.asset?.name} />
        </figure>
    )
}