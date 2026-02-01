export type DiceFace = 2 | 3 | 4 | 6 | 8 | 10 | 12 | 100;

export interface DiceInterface {
  face: DiceFace;
  count: number;
}

export function isDiceInterface(dice: unknown): dice is DiceInterface {
  return (
    typeof dice === "object" &&
    dice !== null &&
    "face" in dice &&
    "count" in dice
  );
}
