import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const addProficiencyMod: Extract<
  ModificationsProp,
  { type: "addProficiency" }
> = {
  name: "",
  type: "addProficiency",
  source: "bard",
  targets: [],
  addProficiencyTo: [],
  limitations: [],
  isActive: false,
};

const addProficiencyToArmorMod: Extract<
  ModificationsProp,
  { type: "addProficiencyToArmor" }
> = {
  name: "protector",
  choseInFeature: { key: "divineOrder", class: "cleric" },
  type: "addProficiencyToArmor",
  source: "cleric",
  armorType: "heavy",
  targets: [{ target: "armorClass", type: "direct" }],
  isActive: false,
};

const addProficiencyToWeaponMod: Extract<
  ModificationsProp,
  { type: "addProficiencyToWeapon" }
> = {
  name: "protector",
  choseInFeature: { key: "divineOrder", class: "cleric" },
  type: "addProficiencyToWeapon",
  source: "cleric",
  weaponProficiency: "allMartial",
  targets: [{ target: "weaponProficiency", type: "direct" }],
  isActive: false,
};
