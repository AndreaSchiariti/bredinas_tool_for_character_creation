import type {
  BecomingClass,
  CharacterStartingEquipment,
  ClassSkillProficiencies,
  ClassToolProficiencies,
  PrimaryClassAbilities,
  Subclasses,
  WeaponProficencies,
  CustomSubclasses,
  CustomPrimaryClassAbilities,
  CharacterModifications,
  ArmorTraining,
} from "./characterClassesUtils.types";
import type {} from "./trackModifications.types";
import type { DiceFace } from "./generalRules.types";
import type { SavingThrow } from "./features.type.ts/abilitiesAndSkills.type";
import type { CharacterClassesName } from "./features.type.ts/classes.type";

export interface RuleClass {
  name: CharacterClassesName;
  subclass: Subclasses | CustomSubclasses | null;
  level: number;
  primaryAbility: PrimaryClassAbilities | CustomPrimaryClassAbilities;
  hitDie: DiceFace;
  savingThrowProficiency: SavingThrow[];
  weaponProficiency: WeaponProficencies[];
  skillProficiency: ClassSkillProficiencies;
  toolProficiency: ClassToolProficiencies[];
  armorTraining: ArmorTraining;
  startingEquipment: CharacterStartingEquipment;
  becomingClass: BecomingClass;
  classFeature: CharacterModifications[];
  spellcasting?: [];
}
