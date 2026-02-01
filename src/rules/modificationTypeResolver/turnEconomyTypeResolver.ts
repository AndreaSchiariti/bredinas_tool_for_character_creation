import type { Character } from "../../types/character.types";
import type { TurnEconomyProp } from "../../types/characterUtils.type";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import { devConsoleWarn } from "../../utils/general";
import { getModificationId } from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";

type TurnEconomyTypeResolver = Pick<ModificationTypeResolver, "addTurnEconomy" | "changeDescriptionTurnEconomy">

function onAddingTurnEconomy(
  _character: Character,
  target: TurnEconomyProp[],
  mod: Extract<ModificationsProp, { type: "addTurnEconomy" }>,
): TurnEconomyProp[] {
  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      description: mod.description,
      source: mod.source,
      isDescriptionVisible: false,
    },
  ];
}

function onChangingDescriptionTurnEconomy(
  _character: Character,
  target: TurnEconomyProp[],
  mod: Extract<ModificationsProp, { type: "changeDescriptionTurnEconomy" }>,
): TurnEconomyProp[] {
  if (mod.description.length === 0) {
    devConsoleWarn(
      `Empty description for the Action with id ${mod.actionId} to update with`,
      target,
    );

    return target;
  }

  const indexAction = target.findIndex((action) => action.id === mod.actionId);

  if (indexAction === -1) {
    devConsoleWarn(
      `Could not find Action with id ${mod.actionId} to update with new decription`,
      target,
    );
    return target;
  }

  let updatedTurnEconomy = [...target];

  updatedTurnEconomy[indexAction] = {
    ...updatedTurnEconomy[indexAction],
    description: mod.description,
  };

  return updatedTurnEconomy;
}

function onChangingBackDescriptionTurnEconomy(
  _character: Character,
  target: TurnEconomyProp[],
  mod: Extract<ModificationsProp, { type: "changeDescriptionTurnEconomy" }>,
): TurnEconomyProp[] {
  if (mod.originalDescription.length === 0) {
    devConsoleWarn(
      `Empty original description for the Action with id ${mod.actionId} to update with`,
      target,
    );
  }

  const indexAction = target.findIndex((action) => action.id === mod.actionId);

  if (indexAction === -1) {
    devConsoleWarn(
      `Could not find Action with id ${mod.actionId} to update with original description`,
      target,
    );
    return target;
  }

  let updatedTurnEconomy = [...target];

  updatedTurnEconomy[indexAction] = {
    ...updatedTurnEconomy[indexAction],
    description: mod.originalDescription,
  };

  return updatedTurnEconomy;
}

function onRemovingTurnEconomy(
  _character: Character,
  target: TurnEconomyProp[],
  mod: ModificationsProp,
): TurnEconomyProp[] {
  return target.filter(
    (turnEconomy) => turnEconomy.id !== getModificationId(mod),
  );
}

export const turnEconomyTypeResolver: TurnEconomyTypeResolver = {
  addTurnEconomy: { apply: onAddingTurnEconomy, revert: onRemovingTurnEconomy },
  changeDescriptionTurnEconomy: {
    apply: onChangingDescriptionTurnEconomy,
    revert: onChangingBackDescriptionTurnEconomy,
  },
};