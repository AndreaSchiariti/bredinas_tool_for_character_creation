import type { DiceInterface } from "./generalRules.types";

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
  mainHand: boolean,
  offHand: boolean
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

export interface ShieldInterface extends BaseItemInterface{
  type: "shield";
  armorIncrement: number;
  isEquipped: HandEquippedInterface;
}

export type ItemType = WeaponInterface | ShieldInterface