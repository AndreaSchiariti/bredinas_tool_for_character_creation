import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const openIsHealingWhenHP: Extract<
  ModificationsProp,
  { type: "openIsHealingWhenHP" }
> = {
  name: "relentlessRage",
  type: "openIsHealingWhenHP",
  source: "barbarian",
  targets: [{ target: "hitPoints", type: "direct" }],
  triggeringHpValue: 0,
  message: "relentlessRageHealing",
  healingValueRef: {
    type: "conditional",
    condition: "barbarian",
    target: "classLevel",
  },
  modifyHealingRef: { operation: "multiply", value: 2 },
  limitations: ["isNotEnraged"],
  isActive: false,
};
