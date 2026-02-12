import type { RuleClass } from "./characterClasses.types";
import type {
  CharacterArmorClass,
  CharacterSpeed,
  CharacterUnarmedStrike,
  Hp,
  Sizes,
  CharacterTurnEconomy,
  CharacterEquipment,
  CharacterMessage,
  CharacterAttacks,
  CharacterWeaponMastery,
  CharacterReminder,
} from "./characterUtils.type";
import type { CountersInterface } from "./counters.types";
import type {
  AbilityProp,
  CharacterSkills,
} from "./features.type.ts/abilitiesAndSkills.type";
import type { CharacterConditions } from "./features.type.ts/conditions.type";
import type { DamageTypeProp } from "./features.type.ts/damageTypes.type";
import type { CharacterFeats } from "./features.type.ts/feat.type";
import type { CharacterSpellcasting } from "./features.type.ts/spells.type";

export interface Character {
  name: string;
  level: number;
  proficiency: number;
  xp: number;
  hp: Hp;
  isInspired: boolean;
  abilities: AbilityProp[];
  skills: CharacterSkills;
  passivePerception: number;
  armorClass: CharacterArmorClass;
  damageResistances: DamageTypeProp[];
  speed: CharacterSpeed;
  size: Sizes;
  turnEconomy: CharacterTurnEconomy;
  unarmedStrike: CharacterUnarmedStrike;
  equipped: CharacterEquipment;
  counters: CountersInterface[];
  feats: CharacterFeats;
  classes: RuleClass[];
  conditions: CharacterConditions;
  attacks: CharacterAttacks[];
  spellcasting?: CharacterSpellcasting;
  weaponMastery?: CharacterWeaponMastery;
  reminder: CharacterReminder[];
  message: CharacterMessage;
}
