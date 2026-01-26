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
      const minX = interaction.locationX - interaction.xOffsetStart;
      const maxX = interaction.locationX + interaction.xOffsetEnd;
      const minY = interaction.locationY - interaction.yOffsetStart;
      const maxY = interaction.locationY + interaction.yOffsetEnd;

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