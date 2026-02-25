import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const addClassSpellListMod: Extract<
  ModificationsProp,
  { type: "addClassSpellList" }
> = {
  name: "magicalSecret",
  type: "addClassSpellList",
  targets: [{ target: "classes", type: "direct" }],
  source: "bard",
  class: "bard",
  classSpellList: "cleric",
  isActive: false,
};

const addExchangeToSpellcastingMod: Extract<
  ModificationsProp,
  { type: "addExchangeToSpellcasting" }
> = {
  name: "fontOfInspiration",
  type: "addExchangeToSpellcasting",
  source: "bard",
  exchange: "bardicInspiration",
  targets: [{ target: "spellcasting", type: "direct" }],
  isActive: false,
};

const addExtraCantripKnownToClassMod: Extract<
  ModificationsProp,
  { type: "addExtraCantripKnownToClass" }
> = {
  name: "thaumaturge",
  choseInFeature: { key: "divineOrder", class: "cleric" },
  type: "addExtraCantripKnownToClass",
  quantity: 1,
  classSpellList: ["cleric"],
  class: "cleric",
  source: "cleric",
  targets: [{ target: "spellcasting", type: "direct" }],
  isActive: false,
};
