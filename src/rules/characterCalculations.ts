import type { CountersInterface } from "../types/counters.types";
import type { SkillProp } from "../types/features.type.ts/abilitiesAndSkills.type";
import type { SpellComponents } from "../types/features.type.ts/spells.type";
import type { DiceInterface, ModifyValue } from "../types/generalRules.types";
import type { TrackModifications } from "../types/trackModifications.types";
import { devConsoleWarn } from "../utils/general";

export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function calculateAbilityDC(
  proficiency: number,
  abilityModifier: number,
): number {
  return 8 + proficiency + abilityModifier;
}

export function isSameDice(
  dice1: DiceInterface,
  dice2: DiceInterface,
): boolean {
  return dice1.face === dice2.face && dice1.count === dice2.count;
}

export function calculatePassiveSkill(skill: SkillProp): number {
  if (skill.hasAdvantage && skill.hasDisadvantage) {
    return 10 + skill.currentScore;
  } else if (skill.hasAdvantage) {
    return 15 + skill.currentScore;
  } else if (skill.hasDisadvantage) {
    return 5 + skill.currentScore;
  } else {
    return 10 + skill.currentScore;
  }
}

export function calculateProficiency(level: number): number {
  if (level >= 17) {
    return 6;
  } else if (level >= 13) {
    return 5;
  } else if (level >= 9) {
    return 4;
  } else if (level >= 5) {
    return 3;
  } else {
    return 2;
  }
}

export function calculateModifyValue(
  value: number,
  modifyValue: ModifyValue,
): number {
  switch (modifyValue.operation) {
    case "add":
      return value + modifyValue.value;

    case "subtract":
      return value - modifyValue.value;

    case "multiply":
      return value * modifyValue.value;

    default:
      if (modifyValue.value === 0) {
        devConsoleWarn(
          `The modifyValue.value can't be 0 in case of division, risk of infinity`,
          modifyValue,
        );
      }
      return modifyValue.value === 0
        ? 0
        : Math.floor(value / modifyValue.value);
  }
}

export function counterAlreadyPresent(
  countersList: CountersInterface[],
  counterId: string,
): boolean {
  return countersList.some((counter) => counter.id === counterId);
}

export function changeAllCanCastComponent(canCast: boolean): SpellComponents {
  return { somatic: canCast, verbal: canCast, material: canCast };
}

const somaticBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

const verbalBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

const materialBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

export function modificationIsApplied(
  trackModifications: TrackModifications[],
  id: string,
): boolean {
  return trackModifications.some((mod) => mod.id === id);
}

export function relatedModStillActive(
  trackModifications: TrackModifications[],
  blockerSet: Set<TrackModifications["type"]>,
): boolean {
  return trackModifications.some((mod) => blockerSet.has(mod.type));
}

export function changeBackCanCastCheckingModifications(
  trackModifications: TrackModifications[],
): SpellComponents {
  const somatic = !relatedModStillActive(trackModifications, somaticBlockerSet);

  const verbal = !relatedModStillActive(trackModifications, verbalBlockerSet);

  const material = !relatedModStillActive(
    trackModifications,
    materialBlockerSet,
  );

  return { somatic, verbal, material };
}

export const addAdvantageSet = new Set<TrackModifications["type"]>([
  "addAdvantage",
  "addAdvantageEvent",
]);

export const addProficiencySet = new Set<TrackModifications["type"]>([
  "addProficiency",
  "addProficiencyWithChoice",
]);

export const setMinimumTotalSet = new Set<TrackModifications["type"]>([
  "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility",
]);

export const addResistanceSet = new Set<TrackModifications["type"]>([
  "addResistanceEvent",
  "addResistanceConditionEvent",
]);

export const activateConditionSet = new Set<TrackModifications["type"]>([
  "activateConditionEvent"
])
