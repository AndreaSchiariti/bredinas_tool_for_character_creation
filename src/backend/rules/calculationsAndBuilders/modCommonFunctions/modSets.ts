import type { TrackModifications } from "../../../types/modifications.types/trackModifications.types";

// Spellcasting Component Blockers
export const somaticBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

export const verbalBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

export const materialBlockerSet = new Set<TrackModifications["type"]>([
  "stopConcentrationAndSpellcastingConditionEvent",
]);

//

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
  "activateConditionEvent",
]);

export const addExpertiseSet = new Set<TrackModifications["type"]>([
  "addExpertiseToProficiencyWithChoice",
]);

export const addSpellToSpellListSet = new Set<TrackModifications["type"]>([
  "addSpellToClassSpellList",
]);

export const addCantripKnownSet = new Set<TrackModifications["type"]>([
  "addExtraCantripKnownToClass",
]);

