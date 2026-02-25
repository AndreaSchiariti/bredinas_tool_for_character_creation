import type { DiceInterface } from "../../types/generalRules.types/dice.types";

export function isSameDice(
  dice1: DiceInterface,
  dice2: DiceInterface,
): boolean {
  return dice1.face === dice2.face && dice1.count === dice2.count;
}

export function diceToString({ face, count }: DiceInterface): string {
  return `${count}d${face}`;
}