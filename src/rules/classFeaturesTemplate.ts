import type {
  CharacterModifications,
  ClassFeatureDescription,
} from "../types/characterClassesUtils.types";
import type { EventCounterProp } from "../types/EventCounterProp.type";
import type {
  
  ModificationsProp,
  
} from "../types/ModificationProps.type";
import type { ModifyTarget, TargetInterface } from "../types/targets.types";

const modification: CharacterModifications = {
  name: "",
  level: 1,
  description: [],
  modifications: [],
};

// DESCRIPTION ITEMS

const descriptionGeneral: ClassFeatureDescription = {
  content: "",
  type: "general",
};

const descriptionParagraph: ClassFeatureDescription = {
  content: "",
  type: "paragraphGeneral",
};

const descriptionList: ClassFeatureDescription = {
  content: "",
  type: "list",
};

const descriptionSubfeature: ClassFeatureDescription = {
  name: "",
  content: "",
  type: "subfeature",
};

// MODIFICATION ITEMS

const changeDiceMod: Extract<ModificationsProp, { type: "changeDice" }> = {
  name: "",
  type: "changeDice",
  source: "monk",
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
  source: "monk",
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
    condition: "monk",
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
  source: "monk",
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
  source: "monk",
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
    condition: "monk",
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
  source: "monk",
  diceRollFetches: [],
  targets: [],
  limitations: [],
  dice: [{ face: 10, count: 1 }],
  addValue: 0,
  isActive: false,
};

const addTurnEconomyMod: Extract<
  ModificationsProp,
  { type: "addTurnEconomy" }
> = {
  name: "",
  type: "addTurnEconomy",
  source: "monk",
  description: [],
  targets: [{ target: "freeActions", type: "direct" }],
  limitations: [],
  isActive: false,
};

const changeDescriptionTurnEconomyMod: Extract<
  ModificationsProp,
  { type: "changeDescriptionTurnEconomy" }
> = {
  name: "",
  type: "changeDescriptionTurnEconomy",
  source: "monk",
  description: [],
  originalDescription: [],
  actionId: "flurryOfBlows: monk-addTurnEconomy",
  targets: [{ target: "bonusActions", type: "direct" }],
  limitations: [],
  isActive: false,
};

const changeAbilityReferenceMod: Extract<
  ModificationsProp,
  { type: "changeAbilityReference" }
> = {
  name: "",
  type: "changeAbilityReference",
  source: "monk",
  ability: "dexterity",
  targets: [],
  limitations: [],
  isActive: false,
};

const addAbilityMod: Extract<ModificationsProp, { type: "addAbility" }> = {
  name: "",
  type: "addAbility",
  source: "monk",
  ability: "dexterity",
  targets: [],
  limitations: [],
  isActive: false,
};

const addTracerTrackerCounterMod: Extract<
  ModificationsProp,
  { type: "addTracerTrackerCounter" }
> = {
  name: "",
  type: "addTracerTrackerCounter",
  source: "monk",
  targetsToTrack: [],
  targets: [],
  limitations: [],
  replenish: "shortRest",
  isActive: false,
};

const addThrowingDiceEventTrackerCounterMod: Extract<
  ModificationsProp,
  { type: "addThrowingDiceEventTrackerCounter" }
> = {
  name: "",
  type: "addThrowingDiceEventTrackerCounter",
  source: "monk",
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
  source: "monk",
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
  source: "monk",
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
  source: "monk",
  ability: "wisdom",
  targets: [],
  limitations: [],
  isActive: false,
};

const addValueMod: Extract<ModificationsProp, { type: "addValue" }> = {
  name: "",
  type: "addValue",
  source: "monk",
  value: 0,
  targets: [],
  limitations: [],
  isActive: false,
};

const addProficiencyMod: Extract<
  ModificationsProp,
  { type: "addProficiency" }
> = {
  name: "",
  type: "addProficiency",
  source: "monk",
  targets: [],
  addProficiencyTo: [],
  limitations: [],
  isActive: false,
};

// TARGETS ITEM

const directTargetItem: TargetInterface = {
  target: "unarmedStrike",
  type: "direct",
};

const directTargetWithModItem: TargetInterface = {
  target: "unarmedStrike",
  type: "direct",
  targetMod: [],
};

const conditionalTargetItem: TargetInterface = {
  target: "classLevel",
  type: "conditional",
  condition: "",
};

const conditionalTargetWithModItem: TargetInterface = {
  target: "classLevel",
  type: "conditional",
  condition: "",
  targetMod: [],
};

// TargetMod

const multiplyDiceCountMod: Extract<
  ModifyTarget,
  { type: "multiplyDiceCount" }
> = {
  type: "multiplyDiceCount",
  multiplier: 0,
};

const multiplyValueMod: Extract<ModifyTarget, { type: "multiplyValue" }> = {
  type: "multiplyValue",
  multiplier: 0,
};

// Events items

const replanishEvent: Extract<EventCounterProp, { type: "replenishCounter" }> =
  {
    target: [],
    type: "replenishCounter",
    targetId: "",
  };

const trackerHealsEvent: Extract<EventCounterProp, { type: "trackerHeals" }> = {
  target: [],
  type: "trackerHeals",
  diceRoll: [],
};

const cureOneCondition: Extract<
  EventCounterProp,
  { type: "cureOneCondition" }
> = {
  target: [{ target: "isCuringCondition", type: "direct" }],
  type: "cureOneCondition",
  conditions: [],
};
