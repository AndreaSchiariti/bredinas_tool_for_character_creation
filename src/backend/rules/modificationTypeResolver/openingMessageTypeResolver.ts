import type { Character } from "../../types/character.types/character.types";
import type { Hp } from "../../types/character.types/characterUtils.type";
import { hasValueProperty } from "../../types/guardingFunctions/trackModificationsGuards";
import type { ModificationsProp } from "../../types/modifications.types/ModificationProps.type";
import  { devConsoleWarn } from "../../utils/general";
import  { calculateModifyValue } from "../calculationsAndBuilders/characterCalculations";
import { difficultyClassCalculator } from "../calculationsAndBuilders/difficultyClassCalculator";
import  { getTarget } from "../modifications/modificationsExecution";
import type { ModificationTypeResolver } from "../modifications/modificationTypeResolver";

type OpeningMessageTypeResolver = Pick<
  ModificationTypeResolver,
  "openIsHealingWhenHP"
>;

function openingIsHealingWhenHp(
  character: Character,
  target: Hp,
  mod: Extract<ModificationsProp, { type: "openIsHealingWhenHP" }>,
): Hp {
  let healingValue = mod.healingValueRef
    ? getTarget(character, mod.healingValueRef)
    : mod.healingValue;

  if (typeof healingValue !== "number") {
    devConsoleWarn(
      `healing Value for opening when is healing has to be a number`,
      healingValue,
    );
    return target;
  }

  if (mod.modifyHealingRef) {
    healingValue = calculateModifyValue(healingValue, mod.modifyHealingRef);
  }

  const triggeringHp = mod.triggeringModifyHp
    ? calculateModifyValue(target.currentMax, mod.triggeringModifyHp)
    : mod.triggeringHpValue;

  let dcValue: number | undefined = undefined;

  const dcToShow = mod.hasDifficultyClassToShow;

  if (dcToShow) {
    if (dcToShow.difficultyClassRef) {
      const difficultyClassRef = getTarget(
        character,
        dcToShow.difficultyClassRef,
      );

      if (!hasValueProperty(difficultyClassRef)) {
        devConsoleWarn(
          `difficultyClassRef needs the value property`,
          difficultyClassRef,
        );
      } else {
        dcValue = difficultyClassRef.value;
      }
    } else {
      dcValue = dcToShow.dcValue;
    }

    const dcCalculatorType = dcToShow.dcCalculatorType;

    if (dcCalculatorType && typeof dcValue === "number") {
      dcValue = difficultyClassCalculator[dcCalculatorType](dcValue);
    }
  }

  // adding the counterToAddCount to let React know which element
  // to modify on front end side.
  if (target.current <= triggeringHp) {
    return {
      ...target,
      isHealing: {
        isShown: true,
        information: mod.message,
        value1: healingValue,
        value2: dcValue,
        counterToAddCount: dcToShow?.difficultyClassRef,
      },
    };
  }

  return target;
}

function disablingOpenIsHealing(
  _character: Character,
  target: Hp,
  _mod: Extract<ModificationsProp, { type: "openIsHealingWhenHP" }>,
): Hp {
  return target;
}

export const openingMessageTypeResolver: OpeningMessageTypeResolver = {
  openIsHealingWhenHP: {
    apply: openingIsHealingWhenHp,
    revert: disablingOpenIsHealing,
  },
};
