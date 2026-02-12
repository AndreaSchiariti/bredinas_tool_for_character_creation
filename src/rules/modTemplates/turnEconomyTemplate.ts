import type { ModificationsProp } from "../../types/ModificationProps.type";

const addTurnEconomyMod: Extract<
  ModificationsProp,
  { type: "addTurnEconomy" }
> = {
  name: "",
  type: "addTurnEconomy",
  source: "barbarian",
  description: [],
  targets: [{ target: "turnEconomy", type: "direct" }],
  actionType: "actions",
  limitations: [],
  isActive: false,
};

const changeDescriptionTurnEconomyMod: Extract<
  ModificationsProp,
  { type: "changeDescriptionTurnEconomy" }
> = {
  name: "",
  type: "changeDescriptionTurnEconomy",
  source: "barbarian",
  description: [],
  originalDescription: [],
  actionId: "flurryOfBlows: barbarian-addTurnEconomy",
  targets: [{ target: "turnEconomy", type: "direct" }],
  actionType: "actions",
  limitations: [],
  isActive: false,
};
