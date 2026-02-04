function makeStringGuard<T extends string>(set: ReadonlySet<T>) {
  return (value: unknown): value is T =>
    typeof value === "string" && set.has(value as T);
}

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

export const classesArray = [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
] as const;

export type CharacterClassesName = (typeof classesArray)[number];

// Damage Types array and its types

export const damageTypes = [
  "acid",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "poison",
  "psychic",
  "radiant",
  "thunder",
  "bludgeoning",
  "nonMagicalBludgeoning",
  "piercing",
  "nonMagicalPiercing",
  "slashing",
  "nonMagicalSlashing",
] as const;

export type DamageTypes = (typeof damageTypes)[number];

const damageTypesSet = new Set<DamageTypes>(damageTypes);

export const isDamageType = makeStringGuard<DamageTypes>(damageTypesSet);

// Rests array and its types

export const rests = ["shortRest", "longRest", "fullRest"] as const;

export type Replenish = (typeof rests)[number];

export const replenishSet = new Set<Replenish>(rests)

// Conditions array and its types

export const conditions = [
  "charmed",
  "frightened",
  "incapacitated",
  "poisoned",
] as const;

export type Condition = (typeof conditions)[number];

const conditionsSet = new Set<Condition>(conditions);

export type ConditionProp =
  | { isAffecting: boolean; isImmune: false }
  | { isAffecting: false; isImmune: true };

export type ConditionsList = {
  [K in Condition]: ConditionProp;
};

export interface IsCuringCondition {
  isShown: boolean;
  conditionToCure: Condition[];
}
export interface CharacterConditions {
  conditionsList: ConditionsList;
  isCuringCondition: IsCuringCondition;
}

export const isCondition = makeStringGuard<Condition>(conditionsSet);

export function hasIsCuringConditionProperty(
  object: unknown,
): object is IsCuringCondition {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const isCuring = object as {
    isShown?: unknown;
    conditionToCure?: unknown;
  };

  return (
    typeof isCuring.isShown === "boolean" &&
    Array.isArray(isCuring.conditionToCure) &&
    isCuring.conditionToCure.every(isCondition)
  );
}

export const featTypes = [
  "origin", "fightingStyle", "general", "epicBoon"
] as const

export type FeatType = (typeof featTypes)[number]
