import { makeStringGuard } from "../guardingFunctions/stringGuards";
import type { TrackModifications } from "../modifications.types/trackModifications.types";

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

export interface DamageTypeProp {
  type: DamageTypes;
  isResistant: boolean;
  isImmune: boolean;
  isVulnerable: boolean;
  trackModifications: TrackModifications[];
}
