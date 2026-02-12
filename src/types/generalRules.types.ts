export const diceFace = [2,3,4,6,8,10,12,100] as const

export type DiceFace = (typeof diceFace)[number];

export const diceFaceSet = new Set<DiceFace>(diceFace)

export interface DiceInterface {
  face: DiceFace;
  count: number;
}

export const attackTypes = [
  "unarmedStrike",
  "weapon",
  "spell",
  "cantrip",
] as const;

export type AttackType = (typeof attackTypes)[number];

export function isDiceInterface(data: unknown): data is DiceInterface {
  if (data === null || typeof data !== "object") {
    return false
  }

  const dice = data as {
    face?: unknown;
    count?: unknown
  }

  const hasFace = typeof dice.face === "number" && diceFaceSet.has(dice.face as DiceFace)
  const hasCount = typeof dice.count === "number"
  
  return hasFace && hasCount;
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

export const operations = ["add", "subtract", "multiply", "divide"] as const;

export type Operation = (typeof operations)[number];

export interface ModifyValue {
  operation: Operation,
  value: number
}

export interface HasDisadvantageProperty {
  hasDisadvantage: boolean;
}
