import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const addValueBasedOnLevelCounterMod: Extract<
  ModificationsProp,
  { type: "addValueBasedOnLevelCounter" }
> = {
  name: "",
  type: "addValueBasedOnLevelCounter",
  source: "bard",
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
    condition: "bard",
  },
  targets: [{ target: "counters", type: "direct" }],
  isActive: false,
};

const addContinuousEventWithTriggerCounterMod: Extract<
  ModificationsProp,
  { type: "addContinuousEventWithTriggerCounter" }
> = {
  name: "",
  type: "addContinuousEventWithTriggerCounter",
  source: "bard",
  events: [],
  trigger: "",
  targets: [{ target: "counters", type: "direct" }],
  isActive: false,
};

const addTracerTrackerCounterMod: Extract<
  ModificationsProp,
  { type: "addTracerTrackerCounter" }
> = {
  name: "",
  type: "addTracerTrackerCounter",
  source: "bard",
  targetsToTrack: [],
  targets: [],
  limitations: [],
  replenish: "shortRest",
  isActive: false,
};

const addTracerEventCounterMod: Extract<
  ModificationsProp,
  { type: "addTracerEventCounter" }
> = {
  name: "",
  type: "addTracerEventCounter",
  source: "bard",
  usages: 0,
  events: [],
  targets: [],
  limitations: [],
  replenish: "shortRest",
  isActive: false,
};

const addValueTrackerCounterMod: Extract<
  ModificationsProp,
  { type: "addValueTrackerCounter" }
> = {
  name: "",
  type: "addValueTrackerCounter",
  source: "bard",
  valuesToTrack: [],
  targets: [],
  limitations: [],
  isActive: false,
};

const addEventWithTriggerCounterMod: Extract<
  ModificationsProp,
  { type: "addEventWithTriggerCounter" }
> = {
  name: "",
  type: "addEventWithTriggerCounter",
  source: "bard",
  events: [],
  trigger: "",
  targets: [],
  limitations: [],
  isActive: false,
};

const addDifficultyClassCounterMod: Extract<
  ModificationsProp,
  { type: "addDifficultyClassCounter" }
> = {
  name: "",
  type: "addDifficultyClassCounter",
  source: "bard",
  ability: "wisdom",
  targets: [],
  limitations: [],
  isActive: false,
};

const addCountingCounterMod: Extract<
  ModificationsProp,
  { type: "addCountingCounter" }
> = {
  name: "",
  type: "addCountingCounter",
  source: "bard",
  targets: [{ type: "direct", target: "counters" }],
  startingValue: 1,
  reset: "shortRest",
  isActive: false,
};
