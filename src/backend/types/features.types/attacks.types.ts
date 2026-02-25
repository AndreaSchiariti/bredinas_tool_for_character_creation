import type { DiceInterface } from "../generalRules.types/dice.types";
import type { TrackModifications } from "../modifications.types/trackModifications.types";
import type { Ability } from "./abilitiesAndSkills.type";

export const attackTypes = [
  "unarmedStrike",
  "weapon",
  "spell",
  "cantrip",
] as const;

export type AttackType = (typeof attackTypes)[number];

export interface CharacterAttacks {
  name: string;
  id: string;
  type: AttackType;
  damageDice: DiceInterface[];
  baseDamageDice: DiceInterface | 1;
  ability: Ability[];
  abilityUsed: Ability;
  addProficiency: boolean;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  addingValues: number;
  trackModifications: TrackModifications[];
}