import type { Character } from "../../types/character.types/character.types";
import type { CharacterTurnEconomy } from "../../types/character.types/characterUtils.type";
import type { ModificationsProp } from "../../types/modifications.types/ModificationProps.type";
import  { devConsoleWarn } from "../../utils/general";
import  { getModificationId } from "../calculationsAndBuilders/idBuilder";
import type { ModificationTypeResolver } from "../modifications/modificationTypeResolver";

type TurnEconomyTypeResolver = Pick<
  ModificationTypeResolver,
  "addTurnEconomy" | "changeDescriptionTurnEconomy"
>;

function onAddingTurnEconomy(
  _character: Character,
  target: CharacterTurnEconomy,
  mod: Extract<ModificationsProp, { type: "addTurnEconomy" }>,
): CharacterTurnEconomy {
  const updatedTurnEconomy = { ...target };

  updatedTurnEconomy[mod.actionType] = [
    ...updatedTurnEconomy[mod.actionType],
    {
      name: mod.name,
      id: getModificationId(mod),
      description: mod.description,
      source: mod.source,
      isDescriptionVisible: false,
    },
  ];

  return updatedTurnEconomy;
}

function onChangingDescriptionTurnEconomy(
  _character: Character,
  target: CharacterTurnEconomy,
  mod: Extract<ModificationsProp, { type: "changeDescriptionTurnEconomy" }>,
): CharacterTurnEconomy {
  if (mod.description.length === 0) {
    devConsoleWarn(
      `Empty description for the Action with id ${mod.actionId} to update with`,
      target,
    );

    return target;
  }

  const updatedTurnEconomy = { ...target };
  const typeToUpdate = [...updatedTurnEconomy[mod.actionType]];

  const indexAction = typeToUpdate.findIndex(
    (action) => action.id === mod.actionId,
  );

  if (indexAction === -1) {
    devConsoleWarn(
      `Could not find Action with id ${mod.actionId} to update with new decription`,
      target,
    );
    return target;
  }

  typeToUpdate[indexAction] = {
    ...typeToUpdate[indexAction],
    description: mod.description,
  };

  updatedTurnEconomy[mod.actionType] = typeToUpdate;

  return updatedTurnEconomy;
}

function onChangingBackDescriptionTurnEconomy(
  _character: Character,
  target: CharacterTurnEconomy,
  mod: Extract<ModificationsProp, { type: "changeDescriptionTurnEconomy" }>,
): CharacterTurnEconomy {
  if (mod.originalDescription.length === 0) {
    devConsoleWarn(
      `Empty original description for the Action with id ${mod.actionId} to update with`,
      target,
    );

    return target;
  }

  const updatedTurnEconomy = { ...target };
  const typeToUpdate = [...updatedTurnEconomy[mod.actionType]];

  const indexAction = typeToUpdate.findIndex(
    (action) => action.id === mod.actionId,
  );

  if (indexAction === -1) {
    devConsoleWarn(
      `Could not find Action with id ${mod.actionId} to update with original description`,
      target,
    );
    return target;
  }

  typeToUpdate[indexAction] = {
    ...typeToUpdate[indexAction],
    description: mod.originalDescription,
  };

  updatedTurnEconomy[mod.actionType] = typeToUpdate;

  return updatedTurnEconomy;
}

function onRemovingTurnEconomy(
  _character: Character,
  target: CharacterTurnEconomy,
  mod: Extract<ModificationsProp, { type: "addTurnEconomy" }>,
): CharacterTurnEconomy {
  const updatedTurnEconomy = { ...target };

  updatedTurnEconomy[mod.actionType] = updatedTurnEconomy[
    mod.actionType
  ].filter((turnEconomy) => turnEconomy.id !== getModificationId(mod));

  return updatedTurnEconomy;
}

export const turnEconomyTypeResolver: TurnEconomyTypeResolver = {
  addTurnEconomy: { apply: onAddingTurnEconomy, revert: onRemovingTurnEconomy },
  changeDescriptionTurnEconomy: {
    apply: onChangingDescriptionTurnEconomy,
    revert: onChangingBackDescriptionTurnEconomy,
  },
};
