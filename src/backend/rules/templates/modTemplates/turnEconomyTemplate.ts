import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const addTurnEconomyMod: Extract<
  ModificationsProp,
  { type: "addTurnEconomy" }
> = {
  name: "",
  type: "addTurnEconomy",
  source: "bard",
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
  source: "bard",
  description: [],
  originalDescription: [],
  actionId: "flurryOfBlows: bard-addTurnEconomy",
  targets: [{ target: "turnEconomy", type: "direct" }],
  actionType: "actions",
  limitations: [],
  isActive: false,
};
