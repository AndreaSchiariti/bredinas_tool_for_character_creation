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

export type Level =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type LevelKey = `level${Level}`;

export function isLevel(value: unknown): value is Level {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 20
  );
}