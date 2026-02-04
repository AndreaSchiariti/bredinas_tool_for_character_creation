import type {
  HasTrackModifications,
  TrackModifications,
} from "../types/trackModifications.types";
import type { ModificationsProp } from "../types/ModificationProps.type";

type IdBuilder<T extends ModificationsProp> = (mod: T) => string;

type IdBuilders = {
  [K in ModificationsProp["type"]]: IdBuilder<
    Extract<ModificationsProp, { type: K }>
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
  addTracerTrackerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDifficultyClassCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addEventCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addEventWithTriggerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addContinousEventWithTriggerCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addThrowingDiceEventTrackerCounter: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  addValueTrackerCounter: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addTurnEconomy: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  changeDescriptionTurnEconomy: (mod) =>
    `${mod.name}: ${mod.source}-${mod.type}`,
  changeAbilityReference: (mod) =>
    `${mod.name}: ${mod.ability}-${mod.source}-${mod.type}`,
  addAbility: (mod) => `${mod.name}: ${mod.ability}-${mod.source}-${mod.type}`,
  addValue: (mod) => `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueToAbility: (mod) =>
    `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueToSkill: (mod) =>
    `${mod.name}: ${mod.value}-${mod.source}-${mod.type}`,
  addValueBasedOnLevel: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addDamageType: (mod) =>
    `${mod.name}: ${mod.damageType}-${mod.source}-${mod.type}`,
  addProficiency: (mod) => `${mod.name}: ${mod.source}-${mod.type}`,
  addFeat: (mod) => `${mod.name}: ${mod.source}-${mod.type}-level${mod.level}`,
  increaseMaxLimit: (mod) =>
    `${mod.name}: ${mod.newMaxValue}-${mod.source}-${mod.type}`,
};

export function getModificationId<K extends ModificationsProp["type"]>(
  mod: Extract<ModificationsProp, { type: K }>,
): string {
  return idBuilders[mod.type](mod);
}

export function removeFromTrackModificationsById<
  K extends ModificationsProp["type"],
>(
  target: HasTrackModifications,
  mod: Extract<ModificationsProp, { type: K }>,
): TrackModifications[] {
  return [...target.trackModifications].filter(
    (element) => element.id !== getModificationId(mod),
  );
}
