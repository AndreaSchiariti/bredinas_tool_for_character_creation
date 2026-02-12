import type { ModificationsProp } from "../../types/ModificationProps.type";

const changeDiceMod: Extract<ModificationsProp, { type: "changeDice" }> = {
  name: "",
  type: "changeDice",
  source: "barbarian",
  dice: { count: 0, face: 8 },
  targets: [],
  limitations: [],
  isActive: false,
};

const chageDiceBasedOnLevelMod: Extract<
  ModificationsProp,
  { type: "changeDiceBasedOnLevel" }
> = {
  name: "",
  type: "changeDiceBasedOnLevel",
  source: "barbarian",
  diceOnLevel: {
    level1: { face: 6, count: 1 },
    level2: { face: 6, count: 1 },
    level3: { face: 6, count: 1 },
    level4: { face: 6, count: 1 },
    level5: { face: 8, count: 1 },
    level6: { face: 8, count: 1 },
    level7: { face: 8, count: 1 },
    level8: { face: 8, count: 1 },
    level9: { face: 8, count: 1 },
    level10: { face: 8, count: 1 },
    level11: { face: 10, count: 1 },
    level12: { face: 10, count: 1 },
    level13: { face: 10, count: 1 },
    level14: { face: 10, count: 1 },
    level15: { face: 10, count: 1 },
    level16: { face: 10, count: 1 },
    level17: { face: 12, count: 1 },
    level18: { face: 12, count: 1 },
    level19: { face: 12, count: 1 },
    level20: { face: 12, count: 1 },
  },
  levelRef: {
    target: "classLevel",
    type: "conditional",
    condition: "barbarian",
  },
  targets: [],
  limitations: [],
  isActive: false,
};

const addDiceCounterMod: Extract<
  ModificationsProp,
  { type: "addDiceCounter" }
> = {
  name: "",
  type: "addDiceCounter",
  source: "barbarian",
  dice: { count: 0, face: 8 },
  targets: [],
  limitations: [],
  isActive: false,
};

const addDiceBaseOnLevelCounterMod: Extract<
  ModificationsProp,
  { type: "addDiceBasedOnLevelCounter" }
> = {
  name: "",
  type: "addDiceBasedOnLevelCounter",
  source: "barbarian",
  diceOnLevel: {
    level1: { face: 6, count: 1 },
    level2: { face: 6, count: 1 },
    level3: { face: 6, count: 1 },
    level4: { face: 6, count: 1 },
    level5: { face: 8, count: 1 },
    level6: { face: 8, count: 1 },
    level7: { face: 8, count: 1 },
    level8: { face: 8, count: 1 },
    level9: { face: 8, count: 1 },
    level10: { face: 8, count: 1 },
    level11: { face: 10, count: 1 },
    level12: { face: 10, count: 1 },
    level13: { face: 10, count: 1 },
    level14: { face: 10, count: 1 },
    level15: { face: 10, count: 1 },
    level16: { face: 10, count: 1 },
    level17: { face: 12, count: 1 },
    level18: { face: 12, count: 1 },
    level19: { face: 12, count: 1 },
    level20: { face: 12, count: 1 },
  },
  levelRef: {
    target: "classLevel",
    type: "conditional",
    condition: "barbarian",
  },
  targets: [{ target: "counters", type: "direct" }],
  limitations: [],
  isActive: false,
};

const addDiceTrackerWithValuesMod: Extract<
  ModificationsProp,
  { type: "addDiceTrackerWithValuesCounter" }
> = {
  name: "",
  type: "addDiceTrackerWithValuesCounter",
  source: "barbarian",
  diceRollFetches: [],
  targets: [],
  limitations: [],
  dice: [{ face: 10, count: 1 }],
  addValue: 0,
  isActive: false,
};
