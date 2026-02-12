import type { ModificationsProp } from "../../types/ModificationProps.type";

const changeAbilityReferenceMod: Extract<
  ModificationsProp,
  { type: "changeAbilityReference" }
> = {
  name: "",
  type: "changeAbilityReference",
  source: "barbarian",
  ability: "dexterity",
  targets: [],
  limitations: [],
  isActive: false,
};

const addAbilityMod: Extract<ModificationsProp, { type: "addAbility" }> = {
  name: "",
  type: "addAbility",
  source: "barbarian",
  ability: "dexterity",
  targets: [],
  limitations: [],
  isActive: false,
};

const addAbilityToSkillMod: Extract<
  ModificationsProp,
  { type: "addAbilityToSkill" }
> = {
  name: "",
  type: "addAbilityToSkill",
  source: "barbarian",
  ability: "strength",
  toWhichSkill: [],
  targets: [{ target: "skills", type: "direct" }],
  limitations: [],
  isActive: false,
};

const addValueToAbilityMod: Extract<
  ModificationsProp,
  { type: "addValueToAbility" }
> = {
  name: "",
  type: "addValueToAbility",
  source: "barbarian",
  targets: [{ target: "abilities", type: "direct" }],
  toWhichFeature: [],
  value: 0,
  limitations: [],
  isActive: false,
};

const addValueToSkillMod: Extract<
  ModificationsProp,
  { type: "addValueToSkill" }
> = {
  name: "",
  type: "addValueToSkill",
  source: "barbarian",
  targets: [{ target: "abilities", type: "direct" }],
  toWhichFeature: [],
  value: 0,
  limitations: [],
  isActive: false,
};

const addProficiencyMod: Extract<
  ModificationsProp,
  { type: "addProficiency" }
> = {
  name: "",
  type: "addProficiency",
  source: "barbarian",
  targets: [],
  addProficiencyTo: [],
  limitations: [],
  isActive: false,
};

const increaseMaxLimitMod: Extract<
  ModificationsProp,
  { type: "increaseMaxLimit" }
> = {
  name: "",
  type: "increaseMaxLimit",
  source: "barbarian",
  targets: [{ target: "abilities", type: "direct" }],
  toWhichAbility: [],
  newMaxValue: 20,
  limitations: [],
  isActive: false,
};

const addAdvantageMod: Extract<ModificationsProp, { type: "addAdvantage" }> = {
  name: "",
  type: "addAdvantage",
  source: "barbarian",
  features: [],
  targets: [{ target: "skills", type: "direct" }],
  limitations: [],
  isActive: false,
};

const AddProficiencyWithChoice: Extract<
  ModificationsProp,
  { type: "addProficiencyWithChoice" }
> = {
  name: "primalKnowledge",
  type: "addProficiencyWithChoice",
  targets: [{ target: "skills", type: "direct" }],
  skillsToChoose: [
    "animalHandling",
    "athletics",
    "intimidation",
    "nature",
    "perception",
    "survival",
  ],
  howMany: 1,
  source: "barbarian",
  isActive: false,
};

const setAbilityScoreAsMinimumTotalToSkillsBasedOnAbilitymod: Extract<
  ModificationsProp,
  { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
> = {
  name: "indomitableMight",
  type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility",
  source: "barbarian",
  abilityScore: {
    target: "abilityCurrentScore",
    type: "conditional",
    condition: "strength",
  },
  skillsAbilityAffected: ["strength"],
  targets: [{ target: "skills", type: "direct" }],
  isActive: false,
};



