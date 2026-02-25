import type { EventCounterProp } from "../../../types/events.types/EventCounterProp.type";

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
  message: "",
};

const cureOneConditionEvent: Extract<
  EventCounterProp,
  { type: "cureOneCondition" }
> = {
  target: [{ target: "conditions", type: "direct" }],
  type: "cureOneCondition",
  conditions: [],
};

const useResourceEvent: Extract<EventCounterProp, { type: "useResource" }> = {
  target: [{ target: "counters", type: "direct" }],
  type: "useResource",
  targetId: "",
  resourcesToUse: 3,
  message: "",
  resetCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "superiorDefense: barbarian-addContinousEventWithTriggerCounter",
  },
};

const addResistanceEvent: Extract<
  EventCounterProp,
  { type: "addResistanceEvent" }
> = {
  target: [{ target: "damageResistances", type: "direct" }],
  type: "addResistanceEvent",
  addResistancesTo: [],
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "superiorDefense: barbarian-addContinousEventWithTriggerCounter",
  },
};

const activateConditionEvent: Extract<
  EventCounterProp,
  { type: "activateConditionEvent" }
> = {
  target: [{ target: "conditions", type: "direct" }],
  type: "activateConditionEvent",
  conditionsToActivate: [],
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "rageStarter: barbarian-addContinuousEventWithTriggerCounter",
  },
};

const addAdvantageEvent: Extract<
  EventCounterProp,
  { type: "addAdvantageEvent" }
> = {
  target: [{ target: "attacks", type: "direct" }],
  type: "addAdvantageEvent",
  scope: "attacks",
  features: ["strength"],
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "recklessAttack: barbarian-addContinuousEventWithTriggerCounter",
  },
};

const addReminderEvent: Extract<
  EventCounterProp,
  { type: "addReminderEvent" }
> = {
  target: [{ target: "reminder", type: "direct" }],
  type: "addReminderEvent",
  content: "",
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "recklessAttack: barbarian-addContinuousEventWithTriggerCounter",
  },
};

const addFetchedScoreEvent: Extract<
  EventCounterProp,
  { type: "addFetchedScoreEvent" }
> = {
  target: [],
  type: "addFetchedScoreEvent",
  fetchedFeature: { target: "speed", type: "direct" },
  modifyValue: {
    operation: "divide",
    value: 2,
  },
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition:
      "instinctivePounce: barbarian-addContinousEventWithTriggerCounter",
  },
};

const addDiceToAttackBasedOnAbilityEvent: Extract<
  EventCounterProp,
  { type: "addDiceToAttackBasedOnAbilityEvent" }
> = {
  target: [{ target: "attacks", type: "direct" }],
  type: "addDiceToAttackBasedOnAbilityEvent",
  diceToAdd: {
    face: 10,
    count: 1,
  },
  ability: ["strength"],
  activeCounterRef: {
    target: "counterById",
    type: "conditional",
    condition: "brutalStrike: barbarian-addContinousEventWithTriggerCounter",
  },
  limitations: ["hasDisadvantage"],
};
