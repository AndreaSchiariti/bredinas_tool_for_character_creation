export const diceFace = [2, 3, 4, 6, 8, 10, 12, 100] as const;

export type DiceFace = (typeof diceFace)[number];

export const diceFaceSet = new Set<DiceFace>(diceFace);

export interface DiceInterface {
  face: DiceFace;
  count: number;
}
