import { use } from "react";
import styles from "./TileMap.module.css"
import { Entity } from "./Entity";

const locationMapFetch = fetch("/api/LocationMaps").then(x => x.json())
const InteractionMapFetch = fetch("/api/InteractionMaps").then(x => x.json())

export const TileMap = () => {
    const locationMapData = use(locationMapFetch);
    const interactionMapData = use(InteractionMapFetch);

    return (
        <div className={styles.tileMap}>
            {locationMapData.map((entity: any) => (
                <Entity key={entity.locationId} data={entity}/>
            ))}
        </div>
    )
}