import type { Character } from "../types/character.types";
import type {
  CharacterArmorClass,
  CharacterAttacks,
  CharacterMessage,
  CharacterReminder,
  CharacterSpeed,
  CharacterTurnEconomy,
  CharacterUnarmedStrike,
  CharacterWeaponMastery,
  Hp,
} from "../types/characterUtils.type";
import type { CountersInterface } from "../types/counters.types";
import type {
  AbilityProp,
  CharacterSkills,
} from "../types/features.type.ts/abilitiesAndSkills.type";
import type { CharacterConditions } from "../types/features.type.ts/conditions.type";
import type { DamageTypeProp } from "../types/features.type.ts/damageTypes.type";
import type { CharacterFeats } from "../types/features.type.ts/feat.type";
import type { CharacterSpellcasting } from "../types/features.type.ts/spells.type";
import type { ShieldInterface, WeaponInterface } from "../types/items.types";

export interface DirectTargetMap {
  unarmedStrike: CharacterUnarmedStrike;
  counters: CountersInterface[];
  mainHand: WeaponInterface | ShieldInterface | null;
  offHand: WeaponInterface | ShieldInterface | null;
  classArmor: CharacterArmorClass;
  speed: CharacterSpeed;
  hitPoints: Hp;
  conditions: CharacterConditions;
  skills: CharacterSkills;
  message: CharacterMessage;
  damageResistances: DamageTypeProp[];
  feats: CharacterFeats;
  abilities: AbilityProp[];
  turnEconomy: CharacterTurnEconomy;
  attacks: CharacterAttacks[];
  spellcasting: CharacterSpellcasting | null;
  weaponMastery: CharacterWeaponMastery | null;
  reminder: CharacterReminder[];
}

type DirectTargetResolver = {
  [K in keyof DirectTargetMap]: (character: Character) => DirectTargetMap[K];
};

export const directTargetResolver: DirectTargetResolver = {
  unarmedStrike: (character: Character) => character.unarmedStrike,
  counters: (character: Character) => character.counters,
  mainHand: (character: Character) => character.equipped.mainHand,
  offHand: (character: Character) => character.equipped.offHand,
  classArmor: (character: Character) => character.armorClass,
  speed: (character: Character) => character.speed,
  hitPoints: (character: Character) => character.hp,
  conditions: (character: Character) => character.conditions,
  skills: (character: Character) => character.skills,
  message: (character: Character) => character.message,
  damageResistances: (character: Character) => character.damageResistances,
  feats: (character: Character) => character.feats,
  abilities: (character: Character) => character.abilities,
  turnEconomy: (character: Character) => character.turnEconomy,
  attacks: (character: Character) => character.attacks,
  spellcasting: (character: Character) =>
    character.spellcasting ? character.spellcasting : null,
  weaponMastery: (character: Character) =>
    character.weaponMastery ? character.weaponMastery : null,
  reminder: (character: Character) => character.reminder,
};

const directTargetList: (keyof DirectTargetMap)[] = [
  "unarmedStrike",
  "counters",
  "mainHand",
  "offHand",
  "classArmor",
  "speed",
  "hitPoints",
  "conditions",
  "skills",
  "message",
  "damageResistances",
  "feats",
  "abilities",
  "turnEconomy",
  "attacks",
  "spellcasting",
  "weaponMastery",
  "reminder",
];

export const directTargetSet = new Set<keyof DirectTargetMap>(directTargetList)
