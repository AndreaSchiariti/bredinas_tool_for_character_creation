import { useMemo } from "react";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";
import {
  convertFeetToMeters,
  convertFeetToSquares,
} from "../rules/unitConversions";
import type { Units } from "../types/characterUtils.type";

export function usePreferredUnit(feet: number): string {
  const { preferredUnit } = useUserPreferencesContext();

  const unitRenders: Record<Units, (feet:number) => string> = {
    feet: (feet: number): string => {
      return `${feet} ft`;
    },
    squares: (feet: number): string => {
      return `${convertFeetToSquares(feet)} □`;
    },
    meters: (feet: number): string => {
      return `${convertFeetToMeters(feet)} m`;
    },
  };

  return useMemo<string>(
    () => unitRenders[preferredUnit](feet),
    [feet, preferredUnit],
  );
}
