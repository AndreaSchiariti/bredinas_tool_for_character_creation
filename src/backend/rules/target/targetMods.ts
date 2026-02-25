import { isDiceInterface } from "../../types/guardingFunctions/generalFeaturesGuards";
import type { ModifyTarget, AllTargetValues } from "../../types/targets.types/targets.types";
import  { devConsoleWarn } from "../../utils/general";


export interface TargetModsMap {
  multiplyDiceCount: {
    mod: Extract<ModifyTarget, { type: "multiplyDiceCount" }>;
  };
  multiplyValue: {
    mod: Extract<ModifyTarget, { type: "multiplyValue" }>;
  };
}

type TargetModsResolver = {
  [K in keyof TargetModsMap]: (
    target: AllTargetValues,
    mod: TargetModsMap[K]["mod"],
  ) => AllTargetValues;
};

function onDiceCountMultiplier(
  target: AllTargetValues,
  mod: Extract<ModifyTarget, { type: "multiplyDiceCount" }>,
): AllTargetValues {
  if (!isDiceInterface(target)) {
    devConsoleWarn(
      `${target} is not a DiceInterface, can't multiply the count`,
      target,
    );
    return target;
  }

  return { ...target, count: target.count * mod.multiplier };
}

function onValueMultiplier(
  target: AllTargetValues,
  mod: Extract<ModifyTarget, { type: "multiplyValue" }>,
): AllTargetValues {
  if (typeof target !== "number") {
    devConsoleWarn(
      `${target} is not a number, can't multiply its value`,
      target,
    );
    return target;
  }

  return target * mod.multiplier;
}

export const targetModsResolver: TargetModsResolver = {
  multiplyDiceCount: onDiceCountMultiplier,
  multiplyValue: onValueMultiplier,
};

export function applyTargetMods(
  target: AllTargetValues,
  mod: ModifyTarget,
): AllTargetValues {
  return targetModsResolver[mod.type](target, mod as any);
}
