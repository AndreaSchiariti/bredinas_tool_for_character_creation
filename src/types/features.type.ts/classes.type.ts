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

export type NonSpellcastingClassesName = Exclude<CharacterClassesName, SpellcastingClassesName>
