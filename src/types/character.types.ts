import type { CharacterConditions } from "../rules/arrayOfFeatures";
import type { RuleClass } from "./characterClasses.types";
import type {
  AbilityProp,
  CharacterArmorClass,
  CharacterSpeed,
  CharacterUnarmedStrike,
  DamageTypeProp,
  Hp,
  Sizes,
  SkillProp,
  CharacterTurnEconomy,
  CharacterEquipment,
} from "./characterUtils.type";
import type { CountersInterface } from "./counters.types";

export interface Character {
  name: string;
  level: number;
  proficiency: number;
  xp: number;
  hp: Hp;
  isInspired: boolean;
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
  classes: RuleClass[];
  conditions: CharacterConditions
}
