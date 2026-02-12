export const weaponList = [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "lightHammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
  "dart",
  "lightCrossbow",
  "shortBow",
  "sling",
  "battleaxe",
  "flail",
  "glaive",
  "greataxe",
  "greatsword",
  "halberd",
  "lance",
  "longsword",
  "maul",
  "morningstar",
  "pike",
  "rapier",
  "scimitar",
  "shortsword",
  "trident",
  "warhammer",
  "warPick",
  "whip",
  "blowgun",
  "handCrossbow",
  "heavyCrossbow",
  "longbow",
  "musket",
  "pistol",
] as const;

export type CoreWeaponName = (typeof weaponList)[number];

const weaponPropertiesList = [
  "ammunition",
  "finesse",
  "heavy",
  "light",
  "loading",
  "range",
  "reach",
  "thrown",
  "twoHanded",
  "versatile",
] as const;

export type CoreWeaponProperties = (typeof weaponPropertiesList)[number];

const weaponMasteryList = [
  "cleave",
  "graze",
  "nick",
  "push",
  "sap",
  "slow",
  "topple",
  "vex",
] as const;

export type CoreWeaponMastery = (typeof weaponMasteryList)[number]
