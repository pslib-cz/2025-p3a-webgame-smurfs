import { useEffect, useState } from "react";
import type { InteractionMapDTO } from "../Types/database-types";

export function useInteractions(
  playerX: number,
  playerY: number,
  interactions: InteractionMapDTO[]
) {
  const [activeInteraction, setActiveInteraction] =
    useState<InteractionMapDTO | null>(null);

  useEffect(() => {
    let found: InteractionMapDTO | null = null;

    for (const interaction of interactions) {
      const spanX = interaction.asset?.spanX || 1;
      const spanY = interaction.asset?.spanY || 1;
      
      const minX = interaction.locationX - interaction.xOffsetStart;
      const maxX = interaction.locationX + spanX - 1 + interaction.xOffsetEnd;
      const minY = interaction.locationY - interaction.yOffsetStart;
      const maxY = interaction.locationY + spanY - 1 + interaction.yOffsetEnd;

      if (
        playerX >= minX &&
        playerX <= maxX &&
        playerY >= minY &&
        playerY <= maxY
      ) {
        found = interaction;
        break;
      }
    }

    setActiveInteraction(found);
  }, [playerX, playerY, interactions]);

  return activeInteraction;
}