import type { Ability } from "../rules/arrayOfFeatures";
import type {
  BecomingClass,
  CharacterStartingEquipment,
  CharacterClassesName,
  ClassSkillProficiencies,
  ClassToolProficiencies,
  PrimaryClassAbilities,
  Subclasses,
  WeaponProficencies,
  CustomSubclasses,
  CustomPrimaryClassAbilities,
  CharacterModifications,
} from "./characterClassesUtils.types";
import type {} from "./trackModifications.types";
import type { HitDice } from "./characterUtils.type";
import type { CountersInterface } from "./counters.types";

export interface RuleClass {
  name: CharacterClassesName;
  subclass: Subclasses | CustomSubclasses | null;
  level: number;
  primaryAbility: PrimaryClassAbilities | CustomPrimaryClassAbilities;
  hitDie: HitDice;
  savingThrowProficiency: Ability[];
  weaponProficiency: WeaponProficencies[];
  skillProficiency: ClassSkillProficiencies;
  toolProficiency: ClassToolProficiencies[];
  armorTraining: [];
  startingEquipment: CharacterStartingEquipment;
  becomingClass: BecomingClass;
  classFeature: CharacterModifications[];
  spellcasting?: [];
  counters: CountersInterface[];
}
