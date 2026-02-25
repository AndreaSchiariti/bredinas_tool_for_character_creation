import type { Ability, Skill } from "../features.types/abilitiesAndSkills.type";
import type { WeaponType } from "../features.types/items.type";
import type { ModificationsProp } from "../modifications.types/ModificationProps.type";
import type { CharacterClassesName } from "../features.types/classes";

export type Subclasses = "warriorOfOpenHand";

export type CustomSubclasses = string & { _customSubclass: true };

export type PrimaryClassAbilities =
  | Ability
  | "dexterityAndWisdom"
  | "dexterityAndCharisma";

export type CustomPrimaryClassAbilities = string & {
  _customPrimaryAbilities: true;
};

export type WeaponProficiencyDetails = "withLightProperty";

export type ToolToChoose =
  | "chooseAnyArtisanalOrInstrument"
  | "chooseThreeMusicalInstruments";

export type ClassFeatureDescriptionType =
  | "general"
  | "paragraphGeneral"
  | "list";

interface SharedDescriptionProperty {
  content: string;
  distance?: number;
  class?: CharacterClassesName;
}

export interface ClassFeatureBaseDescription extends SharedDescriptionProperty {
  type: ClassFeatureDescriptionType;
}

export interface ClassFeatureSubfeatureDescription extends SharedDescriptionProperty {
  name: string;
  type: "subfeature";
}

export type ClassFeatureDescription =
  | ClassFeatureBaseDescription
  | ClassFeatureSubfeatureDescription;

export interface CharacterModifications {
  name: string;
  level: number;
  description: ClassFeatureDescription[];
  modifications: ModificationsProp[];
}

export interface WeaponProficencies {
  type: WeaponType;
  details?: WeaponProficiencyDetails;
}

export interface ClassSkillProficiencies {
  choosingNumber: number;
  skills: ("any" | Skill)[];
}

export interface ClassToolProficiencies {
  toolToChoose: ToolToChoose;
  choosingNumber: number;
}

export interface ArmorTraining {
  light: boolean;
  medium: boolean;
  heavy: boolean;
  shields: boolean;
}

export interface StartingEquipmentSingleItem {
  name: string;
  quantity: number;
}

export interface CharacterStartingEquipment {
  a: StartingEquipmentSingleItem[];
  b: StartingEquipmentSingleItem[];
}

type GainMulticlass =
  | "gainMulticlassBarbarian"
  | "gainMulticlassBard"
  | "gainMulticlassCleric"
  | "gainMulticlassDruid"
  | "gainMulticlassFighter"
  | "gainMulticlassMonk"
  | "gainMulticlassPaladin"
  | "gainMulticlassRanger"
  | "gainMulticlassRogue"
  | "gainMulticlassSorcerer"
  | "gainMulticlassWarlock"
  | "gainMulticlassWizard";

export interface BecomingClass {
  level1: ("gainAllTraits" | "gainLevel1Features")[];
  multiclass: (GainMulticlass | "gainLevel1Features")[];
}
