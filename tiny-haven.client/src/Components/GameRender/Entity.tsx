import type { LocationMapDTO } from "../../Types/database-types"
import style from "./Entity.module.css"

type EntityProps = {
    data: LocationMapDTO;
}

export const Entity: React.FC<EntityProps> = ({ data }) => {
    return (
        <figure 
            className={style.entity}
            style={{
                gridColumn: `${data.locationX} / span ${data.spanX}`,
                gridRow: `${data.locationY} / span ${data.spanY}`,
                zIndex: `calc(${data.locationY} + 10)`
            }}>
                <img src={data.imageUrl ?? "images/placeholder-image.svg"} alt={data.name} loading="lazy"/>
        </figure>
    )
}