import type { DiceInterface } from "../types/generalRules.types";

export function description(feature: string): string {
  return `${feature}Description`;
}

export function diceToString({ face, count }: DiceInterface): string {
  return `${count}d${face}`;
}

export function devConsoleWarn(warning: string, data: unknown) {
  if (import.meta.env.DEV) {
    console.warn(warning, data);
  }
}
