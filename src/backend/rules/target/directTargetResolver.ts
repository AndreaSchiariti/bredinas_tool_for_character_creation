import type { Character } from "../../types/character.types/character.types";
import type { CharacterUnarmedStrike, CharacterArmorClass, CharacterSpeed, Hp, CharacterMessage, CharacterTurnEconomy, CharacterWeaponMastery, CharacterReminder, CharacterBardicInspiration, WeaponProficiencyInterface } from "../../types/character.types/characterUtils.type";
import type { SkillProp, AbilityProp } from "../../types/features.types/abilitiesAndSkills.type";
import type { CharacterAttacks } from "../../types/features.types/attacks.types";
import type { CharacterConditions } from "../../types/features.types/conditions.type";
import type { DamageTypeProp } from "../../types/features.types/damageTypes.type";
import type { Feat } from "../../types/features.types/feat.type";
import type { WeaponInterface, ShieldInterface } from "../../types/features.types/items.type";
import type { CharacterSpellcasting } from "../../types/features.types/spells.type";
import type { CountersInterface } from "../../types/modifications.types/counters.types";
import type { RuleClass } from "../../types/ruleClass.types/ruleClass.types";

export interface DirectTargetMap {
  unarmedStrike: CharacterUnarmedStrike;
  counters: CountersInterface[];
  mainHand: WeaponInterface | ShieldInterface | null;
  offHand: WeaponInterface | ShieldInterface | null;
  armorClass: CharacterArmorClass;
  speed: CharacterSpeed;
  hitPoints: Hp;
  conditions: CharacterConditions;
  skills: SkillProp[];
  message: CharacterMessage;
  damageResistances: DamageTypeProp[];
  feats: Feat[];
  abilities: AbilityProp[];
  turnEconomy: CharacterTurnEconomy;
  attacks: CharacterAttacks[];
  spellcasting: CharacterSpellcasting | undefined;
  weaponMastery: CharacterWeaponMastery | undefined;
  reminder: CharacterReminder[];
  bardicInspiration: CharacterBardicInspiration;
  proficiency: number;
  classes: RuleClass[];
  weaponProficiency: WeaponProficiencyInterface;
}

type DirectTargetResolver = {
  [K in keyof DirectTargetMap]: (character: Character) => DirectTargetMap[K];
};

export const directTargetResolver: DirectTargetResolver = {
  unarmedStrike: (character: Character) => character.unarmedStrike,
  counters: (character: Character) => character.counters,
  mainHand: (character: Character) => character.equipped.mainHand,
  offHand: (character: Character) => character.equipped.offHand,
  armorClass: (character: Character) => character.armorClass,
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
  spellcasting: (character: Character) => character.spellcasting,
  weaponMastery: (character: Character) => character.weaponMastery,
  reminder: (character: Character) => character.reminder,
  bardicInspiration: (character: Character) => character.bardicInspiration,
  proficiency: (character: Character) => character.proficiency,
  classes: (character: Character) => character.classes,
  weaponProficiency: (character: Character) => character.weaponProficiency,
};

const directTargetList: (keyof DirectTargetMap)[] = [
  "unarmedStrike",
  "counters",
  "mainHand",
  "offHand",
  "armorClass",
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
  "bardicInspiration",
  "proficiency",
  "classes",
  "weaponProficiency",
];

export const directTargetSet = new Set<keyof DirectTargetMap>(directTargetList);
