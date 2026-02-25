export const classesArray = [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
] as const;

export type CharacterClassesName = (typeof classesArray)[number];

export type SpellcastingClassesName = Extract<
  CharacterClassesName,
  | "bard"
  | "cleric"
  | "druid"
  | "paladin"
  | "ranger"
  | "sorcerer"
  | "warlock"
  | "wizard"
>;

export type NonSpellcastingClassesName = Exclude<
  CharacterClassesName,
  SpellcastingClassesName
>;

export type CustomClassChoiceName = string & {
  _customclassChoiceOptionName: true;
};

export type CustomClassChoiceContent = string & {
  _customclassChoiceOptionContent: true;
};

export type CustomClassChoiceKey = string & {
  _customclassChoiceOptionKey: true;
};

export type CustomClassChoiceOptions = ReadonlyArray<{
  name: CustomClassChoiceName;
  content: CustomClassChoiceContent;
}>;

export interface CustomClassChoiceInterface {
  key: CustomClassChoiceKey;
  options: CustomClassChoiceOptions;
}

export type CustomClassChoices = Partial<
  Record<CustomClassChoiceKey, CustomClassChoiceName>
>;

const divineOrderOptions = [
  {
    name: "protector",
    content: "protectorDivineOrderDescription",
  },
  {
    name: "thaumaturge",
    content: "thaumaturgeDivineOrderDescription",
  },
] as const;

export type DivineOrderChoice = (typeof divineOrderOptions)[number]["name"];

export type DivineOrderOptions = typeof divineOrderOptions;

export type AllClassChoicesSelection =
  | DivineOrderChoice
  | CustomClassChoiceName;

export type ClassChoiceOptions = {
  key: "divineOrder";
  options: DivineOrderOptions;
};

export interface ClassChoices {
  divineOrder?: DivineOrderChoice;
}

export type ClassChoiceFeatures = keyof ClassChoices;

const choosingClassFeatures = [
  "divineOrder",
] as const satisfies readonly ClassChoiceFeatures[];

export const choosingClassFeaturesSet = new Set<ClassChoiceFeatures>(
  choosingClassFeatures,
);
