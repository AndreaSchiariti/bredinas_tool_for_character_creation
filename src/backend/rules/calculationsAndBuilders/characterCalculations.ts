import type { ModifyValue } from "../../types/generalRules.types/operation.types";
import { devConsoleWarn } from "../../utils/general";

export function calculateModifyValue(
  value: number,
  modifyValue: ModifyValue,
): number {
  switch (modifyValue.operation) {
    case "add":
      return value + modifyValue.value;

    case "subtract":
      return value - modifyValue.value;

    case "multiply":
      return value * modifyValue.value;

    default:
      if (modifyValue.value === 0) {
        devConsoleWarn(
          `The modifyValue.value can't be 0 in case of division, risk of infinity`,
          modifyValue,
        );
      }
      return modifyValue.value === 0
        ? 0
        : Math.floor(value / modifyValue.value);
  }
}


