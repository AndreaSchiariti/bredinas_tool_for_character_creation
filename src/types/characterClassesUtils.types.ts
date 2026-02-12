import type { Ability, Skill } from "./features.type.ts/abilitiesAndSkills.type";
import type { WeaponType } from "./items.types";
import type { ModificationsProp } from "./ModificationProps.type";

export type Subclasses = "warriorOfOpenHand";

export type CustomSubclasses = string & { _customSubclass: true };

export type PrimaryClassAbilities = Ability | "dexterityAndWisdom";

export type CustomPrimaryClassAbilities = string & {
  _customPrimaryAbilities: true;
};

export type WeaponProficiencyDetails = "withLightProperty";

export type ToolToChoose = "chooseAnyArtisanalOrInstrument";

export type ClassFeatureDescriptionType =
  | "general"
  | "paragraphGeneral"
  | "list";

export interface ClassFeatureBaseDescription {
  content: string;
  type: ClassFeatureDescriptionType;
}

export interface ClassFeatureSubfeatureDescription {
  name: string;
  content: string;
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
  skills: Skill[];
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

type GainMulticlass = "gainMulticlassBarbarian" | "gainMulticlassMonk";

export interface BecomingClass {
  level1: ("gainAllTraits" | "gainLevel1Features")[];
  multiclass: (GainMulticlass | "gainLevel1Features")[];
}
