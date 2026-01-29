import { memo } from "react";
import type { LocationMapDTO } from "../../Types/database-types"
import style from "./Entity.module.css"

type EntityProps = {
    data: LocationMapDTO;
}

export const Entity = memo(({ data }: EntityProps) => {
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
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.data.locationId === nextProps.data.locationId &&
        prevProps.data.locationX === nextProps.data.locationX &&
        prevProps.data.locationY === nextProps.data.locationY
    );
});