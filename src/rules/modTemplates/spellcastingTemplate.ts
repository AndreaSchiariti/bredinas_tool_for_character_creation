import type { ModificationsProp } from "../../types/ModificationProps.type";

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