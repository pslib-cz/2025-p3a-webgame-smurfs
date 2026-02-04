import { useEffect, useState } from "react";

export const useDeviceDetection = (breakPoint: number = 852) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const media = window.matchMedia(`(max-width: ${breakPoint}px)`);
        setMatches(media.matches);
        
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [breakPoint]);

    return matches;
};