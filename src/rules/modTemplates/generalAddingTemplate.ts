import type { ModificationsProp } from "../../types/ModificationProps.type";

const addValueBasedOnLevelCounterMod: Extract<
  ModificationsProp,
  { type: "addValueBasedOnLevelCounter" }
> = {
  name: "",
  type: "addValueBasedOnLevelCounter",
  source: "barbarian",
  valueOnLevel: {
    level1: 2,
    level2: 2,
    level3: 2,
    level4: 2,
    level5: 2,
    level6: 2,
    level7: 2,
    level8: 2,
    level9: 3,
    level10: 3,
    level11: 3,
    level12: 3,
    level13: 3,
    level14: 3,
    level15: 3,
    level16: 4,
    level17: 4,
    level18: 4,
    level19: 4,
    level20: 4,
  },
  levelRef: {
    target: "classLevel",
    type: "conditional",
    condition: "barbarian",
  },
  targets: [{ target: "counters", type: "direct" }],
  isActive: false,
};

const addValueMod: Extract<ModificationsProp, { type: "addValue" }> = {
  name: "",
  type: "addValue",
  source: "barbarian",
  value: 0,
  targets: [],
  limitations: [],
  isActive: false,
};

const addFeatMod: Extract<ModificationsProp, { type: "addFeat" }> = {
  name: "abilityScoreImprovement",
  type: "addFeat",
  source: "barbarian",
  level: 4,
  targets: [{ target: "feats", type: "direct" }],
  limitations: [],
  isActive: false,
};

const addWeaponMasteryBasedOnLevelMod: Extract<
  ModificationsProp,
  { type: "addWeaponMasteryBasedOnLevel" }
> = {
  name: "weaponMastery",
  type: "addWeaponMasteryBasedOnLevel",
  source: "barbarian",
  valueOnLevel: {
    level1: 2,
    level2: 2,
    level3: 2,
    level4: 3,
    level5: 3,
    level6: 3,
    level7: 3,
    level8: 3,
    level9: 3,
    level10: 4,
    level11: 4,
    level12: 4,
    level13: 4,
    level14: 4,
    level15: 4,
    level16: 4,
    level17: 4,
    level18: 4,
    level19: 4,
    level20: 4,
  },
  levelRef: {
    target: "classLevel",
    type: "conditional",
    condition: "barbarian",
  },
  targets: [{ target: "weaponMastery", type: "direct" }],
  isActive: false,
};

