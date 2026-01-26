import { createContext, useContext, useState } from "react";
import type { InteractionMapDTO } from "../Types/database-types";

type InteractionContextType = {
  activeInteraction: InteractionMapDTO | null;
  setActiveInteraction: (i: InteractionMapDTO | null) => void;
};

const InteractionContext = createContext<InteractionContextType | null>(null);

export const InteractionProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeInteraction, setActiveInteraction] =
    useState<InteractionMapDTO | null>(null);

  return (
    <InteractionContext.Provider value={{ activeInteraction, setActiveInteraction }}>
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteractionContext = () => {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error("useInteractionContext must be used inside InteractionProvider");
  return ctx;
};
