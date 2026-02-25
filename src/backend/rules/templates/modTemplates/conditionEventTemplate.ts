import type { ConditionEventProp } from "../../../types/events.types/ConditionEventProp.type";

const AddResistanceConditionEvent: Extract<
  ConditionEventProp,
  { type: "addResistanceConditionEvent" }
> = {
  target: [{ target: "damageResistances", type: "direct" }],
  type: "addResistanceConditionEvent",
  addResistancesTo: [],
  activeConditionRef: {
    target: "conditionByName",
    type: "conditional",
    condition: "",
  },
};

const AddValueBasedOnAbilityConditionEvent: Extract<
  ConditionEventProp,
  { type: "addValueToAttacksBasedOnAbilityConditionEvent" }
> = {
  target: [{ target: "attacks", type: "direct" }],
  type: "addValueToAttacksBasedOnAbilityConditionEvent",
  valueToFetch: {
    target: "counterById",
    type: "conditional",
    condition: "rageDamage: barbarian-addValueBasedOnLevelCounter",
  },
  ability: ["strength"],
  activeConditionRef: {
    target: "conditionByName",
    type: "conditional",
    condition: "enraged",
  },
};

const stopConcentrationAndSpellcastingConditionEvent: Extract<
  ConditionEventProp,
  { type: "stopConcentrationAndSpellcastingConditionEvent" }
> = {
  target: [{ target: "spellcasting", type: "direct" }],
  type: "stopConcentrationAndSpellcastingConditionEvent",
  activeConditionRef: {
    target: "conditionByName",
    type: "conditional",
    condition: "enraged",
  },
};

const addBardicInspirationCideConditionEvent: Extract<
  ConditionEventProp,
  { type: "addBardicInspirationDice" }
> = {
  target: [{ target: "bardicInspiration", type: "direct" }],
  type: "addBardicInspirationDice",
  activeConditionRef: {
    target: "conditionByName",
    type: "conditional",
    condition: "bardicInspiration",
  },
};
