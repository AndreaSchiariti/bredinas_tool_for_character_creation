import type {} from "../modifications.types/trackModifications.types";
import type { SavingThrow } from "../features.types/abilitiesAndSkills.type";
import type {
  CharacterClassesName,
  ClassChoices,
  CustomClassChoices,
} from "../features.types/classes";
import type { ClassSpellcasting } from "../features.types/spells.type";
import type {
  Subclasses,
  CustomSubclasses,
  PrimaryClassAbilities,
  CustomPrimaryClassAbilities,
  WeaponProficencies,
  ClassSkillProficiencies,
  ClassToolProficiencies,
  ArmorTraining,
  CharacterStartingEquipment,
  BecomingClass,
  CharacterModifications,
} from "./ruleClassUtils.types";
import type { DiceFace } from "../generalRules.types/dice.types";

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
  spellcasting: ClassSpellcasting;
  classChoices?: ClassChoices;
  customClassChoices?: CustomClassChoices;
}
