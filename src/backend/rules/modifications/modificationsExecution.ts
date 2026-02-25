import type { Character } from "../../types/character.types/character.types";
import type { DiceInterface } from "../../types/generalRules.types/dice.types";
import { isDiceInterface } from "../../types/guardingFunctions/generalFeaturesGuards";
import type {} from "../../types/modifications.types/ModificationProps.type";
import {
  type AllTargetValues,
  type ConditionalTargetInterface,
  type DiceInterfaceOrNumber,
  type DirectTargetInterface,
  type TargetInterface,
} from "../../types/targets.types/targets.types";
import { diceToString } from "../calculationsAndBuilders/diceCalculations";
import {type ConditionalTargetMap, getConditionalTarget } from "../target/conditionalTargetResolver";
import { type DirectTargetMap, directTargetResolver } from "../target/directTargetResolver";
import { applyTargetMods } from "../target/targetMods";


export type DirectTargetValue<T extends DirectTargetInterface> =
  DirectTargetMap[T["target"]];

export type ConditionalTargetValue<T extends ConditionalTargetInterface> =
  ConditionalTargetMap[T["target"]]["value"];

type TargetValue<T extends TargetInterface> = T extends DirectTargetInterface
  ? DirectTargetMap[T["target"]]
  : T extends ConditionalTargetInterface
    ? ConditionalTargetMap[T["target"]]["value"]
    : never;

export function getTarget<T extends TargetInterface>(
  character: Character,
  target: T,
): TargetValue<T> {
  const baseValue =
    target.type === "direct"
      ? directTargetResolver[target.target](character)
      : getConditionalTarget(character, target);

  if (!target.targetMod || target.targetMod.length === 0) {
    return baseValue as TargetValue<T>;
  }

  const modified = target.targetMod.reduce<AllTargetValues>(
    (current, mod) => applyTargetMods(current, mod),
    baseValue as AllTargetValues,
  );

  return modified as TargetValue<T>;
}

// function implemented to extract data from target array when
// it consists only of numbers and strings

export function diceAndNumbersToString(
  target: DiceInterfaceOrNumber[],
): string {
  const arrayOfDices: DiceInterface[] = [];
  let totalNumbers: number = 0;

  for (const element of target) {
    if (isDiceInterface(element)) {
      arrayOfDices.push(element);
    } else if (typeof element === "number") {
      totalNumbers += element;
    }
  }

  const dicesToStringArray: string[] = arrayOfDices.map((dice) =>
    diceToString(dice),
  );

  if (totalNumbers > 0) {
    return [...dicesToStringArray, totalNumbers].join(" + ");
  }

  return dicesToStringArray.join(" + ");
}
