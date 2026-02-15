import type {
  HasTrackModifications,
  TrackModifications,
} from "../types/trackModifications.types";
import {
  isModificationProp,
  type ModificationsProp,
} from "../types/ModificationProps.type";
import type { ConditionEventProp } from "../types/ConditionEventProp.type";

type IdBuilder<T extends ModificationsProp> = (mod: T) => string;

type IdBuilders = {
  [K in ModificationsProp["type"]]: IdBuilder<
    Extract<ModificationsProp, { type: K }>
  >;
};

type IdConditionEventBuilder<T extends ConditionEventProp> = (
  event: T,
) => string;

type IdConditionEventBuilders = {
  [K in ConditionEventProp["type"]]: IdConditionEventBuilder<
    Extract<ConditionEventProp, { type: K }>
  >;
};

const idBuilders: IdBuilders = {
  changeDice: (mod) => `${mod.name}: ${mod.source}-${mod.type}-${mod.dice}`,
  changeDiceBasedOnLevel: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDiceCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDiceBasedOnLevelCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDiceTrackerWithValuesCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addTracerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addTracerBasedOnLevelCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addTracerTrackerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDifficultyClassCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addEventCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addEventWithTriggerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addContinuousEventWithTriggerCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addTracerEventCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addValueTrackerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addTurnEconomy: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  changeDescriptionTurnEconomy: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  changeAbilityReference: (mod) =>
    `${mod.name}: ${mod.ability}-${mod.source}-${mod.type}`,
  addAbility: (mod) => `${mod.name}: ${mod.ability}-${mod.source}-${mod.type}`,
  addAbilityToSkill: (mod) =>
    `${mod.name}: ${mod.ability}-${mod.source}-${mod.type}`,
  addValue: (mod) => `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueToAbility: (mod) =>
    `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueToSkill: (mod) =>
    `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueBasedOnLevel: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addValueBasedOnLevelCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addDamageType: (mod) =>
    `${mod.name}: ${mod.damageType}-${mod.source}-${mod.type}`,
  addProficiency: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addFeat: (mod) => `${mod.name}: ${mod.source}-${mod.type}-level${mod.level}`,
  increaseMaxLimit: (mod) =>
    `${mod.name}: ${mod.newMaxValue}-${mod.source}-${mod.type}`,
  addWeaponMasteryBasedOnLevel: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addAdvantage: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addProficiencyWithChoice: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  openIsHealingWhenHP: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addCountingCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addExpertiseToProficiencyWithChoice: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addValueToAllNotProficientSkills: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
};

const idConditionEventBuilder: IdConditionEventBuilders = {
  addResistanceConditionEvent: (event) =>
    `${event.activeConditionRef.condition}: ${event.type}`,
  addValueToAttacksBasedOnAbilityConditionEvent: (event) =>
    `${event.activeConditionRef.condition}: ${event.type}`,
  stopConcentrationAndSpellcastingConditionEvent: (event) =>
    `${event.activeConditionRef.condition}: ${event.type}`,
  addBardicInspirationDice: (event) =>
    `${event.activeConditionRef.condition}: ${event.type}`,
};

export function getModificationId<K extends ModificationsProp["type"]>(
  mod: Extract<ModificationsProp, { type: K }>,
): string {
  return idBuilders[mod.type](mod);
}

export function getConditionEventId<K extends ConditionEventProp["type"]>(
  event: Extract<ConditionEventProp, { type: K }>,
): string {
  return idConditionEventBuilder[event.type](event);
}

export function removeFromTrackModificationsById(
  target: HasTrackModifications,
  mod: ModificationsProp,
): TrackModifications[];

export function removeFromTrackModificationsById(
  target: HasTrackModifications,
  mod: ConditionEventProp,
): TrackModifications[];

export function removeFromTrackModificationsById(
  target: HasTrackModifications,
  mod: ModificationsProp | ConditionEventProp,
): TrackModifications[] {
  const id = isModificationProp(mod)
    ? getModificationId(mod)
    : getConditionEventId(mod);
  return [...target.trackModifications].filter((element) => element.id !== id);
}
