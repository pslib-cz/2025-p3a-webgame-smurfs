import { memo } from "react";
import style from "./SmurfHouse.module.css"
import type { LocationMapDTO } from "../../../Types/database-types";

type SmurfHouseProps = {
    data: LocationMapDTO;
}

export const SmurfHouse = memo(({ data }: SmurfHouseProps) => {
  return (
    <div
      className={style.entity}
      style={{
        gridColumn: `${data.locationX} / span ${data.spanX}`,
        gridRow: `${data.locationY} / span ${data.spanY}`,
        zIndex: `calc(${data.locationY} + 10)`
      }}
    >
      <img
        src={data.imageUrl ?? "images/game_assets/placeholder-image.svg"}
        alt={data.name}
        loading="lazy"
      />
    </div>
  );
});