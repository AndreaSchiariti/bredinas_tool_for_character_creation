import type { RuleClass } from "../ruleClass.types/ruleClass.types";
import type {
  CharacterArmorClass,
  CharacterSpeed,
  CharacterUnarmedStrike,
  Hp,
  Sizes,
  CharacterTurnEconomy,
  CharacterEquipment,
  CharacterMessage,
  CharacterWeaponMastery,
  CharacterReminder,
  CharacterBardicInspiration,
  WeaponProficiencyInterface,
} from "./characterUtils.type";

import type {
  AbilityProp,
  SkillProp,
} from "../features.types/abilitiesAndSkills.type";
import type { CharacterConditions } from "../features.types/conditions.type";
import type { DamageTypeProp } from "../features.types/damageTypes.type";
import type { Feat } from "../features.types/feat.type";
import type { CharacterSpellcasting } from "../features.types/spells.type";
import type { CountersInterface } from "../modifications.types/counters.types";
import type { CharacterAttacks } from "../features.types/attacks.types";

export interface Character {
  name: string;
  level: number;
  proficiency: number;
  xp: number;
  hp: Hp;
  isInspired: boolean;
  bardicInspiration: CharacterBardicInspiration;
  abilities: AbilityProp[];
  skills: SkillProp[];
  passivePerception: number;
  armorClass: CharacterArmorClass;
  damageResistances: DamageTypeProp[];
  speed: CharacterSpeed;
  size: Sizes;
  turnEconomy: CharacterTurnEconomy;
  unarmedStrike: CharacterUnarmedStrike;
  equipped: CharacterEquipment;
  counters: CountersInterface[];
  feats: Feat[];
  classes: RuleClass[];
  conditions: CharacterConditions;
  attacks: CharacterAttacks[];
  spellcasting?: CharacterSpellcasting;
  weaponProficiency: WeaponProficiencyInterface;
  weaponMastery?: CharacterWeaponMastery;
  reminder: CharacterReminder[];
  message: CharacterMessage;
}
