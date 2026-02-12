import { makeStringGuard } from "../generalGuardingFunction";
import type { TrackModifications } from "../trackModifications.types";

// Abilities array and its types

export const abilitiesArray = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

export type Ability = (typeof abilitiesArray)[number];

const abilitySet = new Set<Ability>(abilitiesArray);

export const isAbility = makeStringGuard<Ability>(abilitySet);

// Skills array and its types

export const skillsArray = [
  "acrobatics",
  "animalHandling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleightOfHand",
  "stealth",
  "survival",
] as const;

export type Skill = (typeof skillsArray)[number];

// Saving Throws array and its types

export const savingThrowArray = [
  "strengthSavingThrow",
  "dexteritySavingThrow",
  "constitutionSavingThrow",
  "intelligenceSavingThrow",
  "wisdomSavingThrow",
  "charismaSavingThrow",
] as const;

export type SavingThrow = (typeof savingThrowArray)[number];

export type SkillPropType = "skill" | "savingThrow" | "initiative";

export const skillPropTypeSet = new Set<SkillPropType>([
  "skill",
  "savingThrow",
  "initiative",
]);

export type SkillPropName = Skill | SavingThrow | "initiative";

export const skillPropNameSet = new Set<SkillPropName>([
  ...skillsArray,
  ...savingThrowArray,
  "initiative",
]);

export interface AbilityProp {
  id: "str" | "dex" | "con" | "int" | "wis" | "cha";
  name: Ability;
  baseScore: number;
  currentScore: number;
  modifier: number;
  trackModifications: TrackModifications[];
  maxLimit: number;
  baseMaxLimit: number;
  difficultyClass: number;
}

export interface SkillBase {
  name: SkillPropName;
  type: SkillPropType;
  ability: Ability[];
  currentAbility: Ability;
  baseAbility: Ability;
  baseScore: number;
  currentScore: number;
  hasExpertise: boolean;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  trackModifications: TrackModifications[];
  minimumCheckTotal ?: number;
}

interface SkillProficiencyNoClass extends SkillBase {
  gainedWithClass: false;
  hasProficiency: boolean;
}

interface SkillProficiencyWithClass extends SkillBase {
  gainedWithClass: true;
  hasProficiency: true;
}

export type SkillProp = SkillProficiencyNoClass | SkillProficiencyWithClass;

type IsAddingProficiencyTrackModTypes = { type: "addProficiencyWithChoice" };

type IsAddingProficiency =
  | {
      isShown: false;
    }
  | {
      isShown: true;
      skillList: SkillPropName[];
      type: "proficiency" | "expertise";
      howMany: number;
      message: string | null;
      modification: Extract<TrackModifications, IsAddingProficiencyTrackModTypes>
    };

export interface CharacterSkills{
  skillsList: SkillProp[],
  isAddingProficiency: IsAddingProficiency
}

export function isSkillProp(data: unknown): data is SkillProp {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const skill = data as {
    name: unknown;
    type: unknown;
    ability: unknown;
    baseScore: unknown;
    currentScore: unknown;
    hasProficiency: unknown;
    hasExpertise: unknown;
    hasAdvantage: unknown;
    hasDisadvantage: unknown;
  };

  const hasName =
    typeof skill.name === "string" &&
    skillPropNameSet.has(skill.name as SkillPropName);

  const hasType =
    typeof skill.type === "string" &&
    skillPropTypeSet.has(skill.type as SkillPropType);

  const hasAbility =
    Array.isArray(skill.ability) && skill.ability.every(isAbility);

  const hasScore =
    typeof skill.currentScore === "number" &&
    typeof skill.baseScore === "number";

  const hasBooleans =
    typeof skill.hasProficiency === "boolean" &&
    typeof skill.hasExpertise === "boolean" &&
    typeof skill.hasAdvantage === "boolean" &&
    typeof skill.hasDisadvantage === "boolean";

  return hasName && hasType && hasAbility && hasScore && hasBooleans;
}
