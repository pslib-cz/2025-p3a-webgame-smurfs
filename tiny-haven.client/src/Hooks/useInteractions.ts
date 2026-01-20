import { useEffect, useState } from "react";

export interface Interaction {
  questId: string;
  questName: string;
  questType: string;
  position: { x: number; y: number };
  offset: {
    beforeX: number;
    afterX: number;
    beforeY: number;
    afterY: number;
  };
}

export function useInteractions(
  playerX: number,
  playerY: number,
  interactions: Interaction[]
) {
  const [activeInteraction, setActiveInteraction] =
    useState<Interaction | null>(null);

  useEffect(() => {
    let found: Interaction | null = null;

    for (const interaction of interactions) {
      const minX = interaction.position.x - interaction.offset.beforeX;
      const maxX = interaction.position.x + interaction.offset.afterX;
      const minY = interaction.position.y - interaction.offset.beforeY;
      const maxY = interaction.position.y + interaction.offset.afterY;

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