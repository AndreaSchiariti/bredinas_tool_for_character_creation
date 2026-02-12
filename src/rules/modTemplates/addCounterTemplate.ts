import type { ModificationsProp } from "../../types/ModificationProps.type";

const addContinuousEventWithTriggerCounterMod: Extract<
  ModificationsProp,
  { type: "addContinuousEventWithTriggerCounter" }
> = {
  name: "",
  type: "addContinuousEventWithTriggerCounter",
  source: "barbarian",
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
  source: "barbarian",
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
  source: "barbarian",
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
  source: "barbarian",
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
  source: "barbarian",
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
  source: "barbarian",
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
  source: "barbarian",
  targets: [{ type: "direct", target: "counters" }],
  startingValue: 1,
  reset: "shortRest",
  isActive: false,
};
