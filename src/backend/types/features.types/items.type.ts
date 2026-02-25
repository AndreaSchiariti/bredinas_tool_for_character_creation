import type { MartialWeaponProficiencyInterface } from "../character.types/characterUtils.type";
import type { DiceInterface } from "../generalRules.types/dice.types";
import type { ArmorTraining } from "../ruleClass.types/ruleClassUtils.types";

export type WeaponType = "simpleWeapon" | "martialWeapon";

export type WeaponDamageDice =
  | "1d4"
  | "1d6"
  | "1d8"
  | "2d4"
  | "1d10"
  | "1d12"
  | "2d6";

export type WeaponProperty =
  | "ammunition"
  | "finesse"
  | "heavy"
  | "light"
  | "loading"
  | "range"
  | "reach"
  | "thrown"
  | "twoHanded"
  | "versatile";

export type WeaponMastery =
  | "cleave"
  | "graze"
  | "nick"
  | "push"
  | "sap"
  | "slow"
  | "topple"
  | "vex";

export type WeaponSubtypes =
  | "simpleMeleeWeapon"
  | "simpleRangedWeapon"
  | "martialMeleeWeapon"
  | "martialRangedWeapon";

export type Currencies =
  | "copperPieces"
  | "silverPieces"
  | "electrumPieces"
  | "goldPieces"
  | "platinumPieces";

export interface HandEquippedInterface {
  mainHand: boolean;
  offHand: boolean;
}

interface BaseItemInterface {
  name: string;
  costValue: number;
  costCurrency: Currencies;
  weight: number;
  description: string;
  trackModifications: string[];
}

export interface WeaponInterface extends BaseItemInterface {
  type: "weapon";
  subType: WeaponSubtypes;
  properties: WeaponProperty[];
  range: [number] | [number, number, number];
  mastery: WeaponMastery;
  damage: DiceInterface;
  isEquipped: HandEquippedInterface;
}

export interface ShieldInterface extends BaseItemInterface {
  type: "shield";
  armorIncrement: number;
  isEquipped: HandEquippedInterface;
}

export type ItemType = WeaponInterface | ShieldInterface;
export const weaponList = [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "lightHammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
  "dart",
  "lightCrossbow",
  "shortBow",
  "sling",
  "battleaxe",
  "flail",
  "glaive",
  "greataxe",
  "greatsword",
  "halberd",
  "lance",
  "longsword",
  "maul",
  "morningstar",
  "pike",
  "rapier",
  "scimitar",
  "shortsword",
  "trident",
  "warhammer",
  "warPick",
  "whip",
  "blowgun",
  "handCrossbow",
  "heavyCrossbow",
  "longbow",
  "musket",
  "pistol",
] as const;

export type CoreWeaponName = (typeof weaponList)[number];

export const weaponPropertiesList = [
  "ammunition",
  "finesse",
  "heavy",
  "light",
  "loading",
  "range",
  "reach",
  "thrown",
  "twoHanded",
  "versatile",
] as const;

export type CoreWeaponProperties = keyof MartialWeaponProficiencyInterface;

export const weaponPropertiesSet = new Set<CoreWeaponProperties>(
  weaponPropertiesList,
);

export type CoreWeaponProficiency =
  | CoreWeaponProperties
  | "simple"
  | "allMartial";

export const coreWeaponProficiencySet = new Set<CoreWeaponProficiency>([
  ...weaponPropertiesList,
  "simple",
  "allMartial",
]);

export const weaponMasteryList = [
  "cleave",
  "graze",
  "nick",
  "push",
  "sap",
  "slow",
  "topple",
  "vex",
] as const;

export type CoreWeaponMastery = (typeof weaponMasteryList)[number];

export const armorType = ["light", "medium", "heavy", "shields"] as const;

export type ArmorType = keyof ArmorTraining;

export const armorTypeSet = new Set<ArmorType>(armorType);
