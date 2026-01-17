import type { AbilityProp, ArmorClass, CharacterSpeed, DamageTypeProp, Hp, Initiative, Sizes, SkillProp } from "./character_utils";

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
  armorClass: ArmorClass;
  damageResistances: DamageTypeProp[];
  initiative: Initiative;
  speed: CharacterSpeed[];
  size: Sizes;
}
