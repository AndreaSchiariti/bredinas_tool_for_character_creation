import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const changeAbilityReferenceMod: Extract<
  ModificationsProp,
  { type: "changeAbilityReference" }
> = {
  name: "",
  type: "changeAbilityReference",
  source: "bard",
  ability: "dexterity",
  targets: [],
  limitations: [],
  isActive: false,
};

const addAbilityMod: Extract<ModificationsProp, { type: "addAbility" }> = {
  name: "",
  type: "addAbility",
  source: "bard",
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
  source: "bard",
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
  source: "bard",
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
  source: "bard",
  targets: [{ target: "abilities", type: "direct" }],
  toWhichFeature: [],
  value: 0,
  limitations: [],
  isActive: false,
};

const increaseMaxLimitMod: Extract<
  ModificationsProp,
  { type: "increaseMaxLimit" }
> = {
  name: "",
  type: "increaseMaxLimit",
  source: "bard",
  targets: [{ target: "abilities", type: "direct" }],
  toWhichAbility: [],
  newMaxValue: 20,
  limitations: [],
  isActive: false,
};

const addAdvantageMod: Extract<ModificationsProp, { type: "addAdvantage" }> = {
  name: "",
  type: "addAdvantage",
  source: "bard",
  features: [],
  targets: [{ target: "skills", type: "direct" }],
  limitations: [],
  isActive: false,
};

const setAbilityScoreAsMinimumTotalToSkillsBasedOnAbilitymod: Extract<
  ModificationsProp,
  { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
> = {
  name: "indomitableMight",
  type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility",
  source: "bard",
  abilityScore: {
    target: "abilityCurrentScore",
    type: "conditional",
    condition: "strength",
  },
  skillsAbilityAffected: ["strength"],
  targets: [{ target: "skills", type: "direct" }],
  isActive: false,
};

const addExpertiseToProficencyWithChoiceMod: Extract<
  ModificationsProp,
  { type: "addExpertiseToProficiencyWithChoice" }
> = {
  name: "expertise",
  type: "addExpertiseToProficiencyWithChoice",
  targets: [{ target: "skills", type: "direct" }],
  howMany: 2,
  source: "bard",
  isActive: false,
};
