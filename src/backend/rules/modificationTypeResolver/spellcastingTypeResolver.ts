import  { ruleSpellList } from "../../data/spells/spellList";
import type { Character } from "../../types/character.types/character.types";
import type { CharacterSpellcasting, SpellLevelInterface, SpellInterfaceAlwaysPrepared, SpellNameAndLevel } from "../../types/features.types/spells.type";
import type { ModificationsProp } from "../../types/modifications.types/ModificationProps.type";
import type { TrackModifications } from "../../types/modifications.types/trackModifications.types";
import type { RuleClass } from "../../types/ruleClass.types/ruleClass.types";
import  { devConsoleWarn, removeFromArrayByIndex } from "../../utils/general";
import  { getModificationId, removeFromTrackModificationsById } from "../calculationsAndBuilders/idBuilder";
import { modificationIsApplied, relatedModStillActive } from "../calculationsAndBuilders/modCommonFunctions/generalModFunctions";
import { addSpellToSpellListSet } from "../calculationsAndBuilders/modCommonFunctions/modSets";
import { refactorCantripsKnown } from "../calculationsAndBuilders/modCommonFunctions/spellcastCalculations";
import type { ModificationTypeResolver } from "../modifications/modificationTypeResolver";

type SpellcastingTypeResolver = Pick<
  ModificationTypeResolver,
  | "addExchangeToSpellcasting"
  | "addClassSpellList"
  | "addSpellToClassSpellList"
  | "addExtraCantripKnownToClass"
>;

function onAddingExchangeToSpellcasting(
  _character: Character,
  target: CharacterSpellcasting,
  mod: Extract<ModificationsProp, { type: "addExchangeToSpellcasting" }>,
): CharacterSpellcasting {
  const modId = getModificationId(mod);

  const thisModification: Extract<
    TrackModifications,
    { type: "addExchangeToSpellcasting" }
  > = {
    name: mod.name,
    type: mod.type,
    source: mod.source,
    exchange: mod.exchange,
    id: modId,
  };

  const alreadyActive = modificationIsApplied(target.trackModifications, modId);

  if (alreadyActive) {
    return target;
  }

  return {
    ...target,
    exchange: [...target.exchange, mod.exchange],
    trackModifications: [...target.trackModifications, thisModification],
  };
}

function onRemovingExchangeToSpellcasting(
  _character: Character,
  target: CharacterSpellcasting,
  mod: Extract<ModificationsProp, { type: "addExchangeToSpellcasting" }>,
): CharacterSpellcasting {
  const modId = getModificationId(mod);

  const isNotApplied = !modificationIsApplied(target.trackModifications, modId);

  if (isNotApplied) {
    return target;
  }

  const updatedTrackModifications = removeFromTrackModificationsById(
    target,
    modId,
  );

  const exchangeIndex = target.exchange.findIndex(
    (exchange) => exchange === mod.exchange,
  );

  if (exchangeIndex === -1) {
    devConsoleWarn(
      `couldn't find ${mod.exchange} in the spellcasting exchange array`,
      mod.exchange,
    );
    return { ...target, trackModifications: updatedTrackModifications };
  }

  return {
    ...target,
    exchange: removeFromArrayByIndex(target.exchange, exchangeIndex),
    trackModifications: updatedTrackModifications,
  };
}

function onAddingClassSpellList(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addClassSpellList" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  const thisModification: Extract<
    TrackModifications,
    { type: "addClassSpellList" }
  > = {
    name: mod.name,
    id: modId,
    type: mod.type,
    source: mod.source,
    classSpellList: mod.classSpellList,
  };

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    const spellcasting = { ...characterClass.spellcasting };

    if (modificationIsApplied(spellcasting.trackModifications, modId)) {
      return characterClass;
    }

    const updatedSpellcasting = {
      ...spellcasting,
      classSpellList: [...spellcasting.classSpellList, mod.classSpellList],
      trackModifications: [
        ...spellcasting.trackModifications,
        thisModification,
      ],
    };

    return { ...characterClass, spellcasting: updatedSpellcasting };
  });
}

function onRemovingClassSpellList(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addClassSpellList" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    const spellcasting = { ...characterClass.spellcasting };

    if (!modificationIsApplied(spellcasting.trackModifications, modId)) {
      return characterClass;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      spellcasting,
      modId,
    );

    let updatedSpellcasting = spellcasting;

    const classSpellListIndex = spellcasting.classSpellList.findIndex(
      (className) => className === mod.classSpellList,
    );

    if (classSpellListIndex === -1) {
      devConsoleWarn(
        `Couldn't find ${mod.classSpellList} in the spellcasting.classSpellList`,
        spellcasting.classSpellList,
      );
      updatedSpellcasting = {
        ...spellcasting,
        trackModifications: updatedTrackModifications,
      };
    } else {
      updatedSpellcasting = {
        ...spellcasting,
        classSpellList: removeFromArrayByIndex(
          spellcasting.classSpellList,
          classSpellListIndex,
        ),
        trackModifications: updatedTrackModifications,
      };
    }

    return { ...characterClass, spellcasting: updatedSpellcasting };
  });
}

function addSpellToList(
  spellList: SpellLevelInterface[],
  spellToAdd: SpellInterfaceAlwaysPrepared,
  modId: string,
): SpellLevelInterface[] {
  const updatedSpellList = [...spellList];

  const levelListIndex = updatedSpellList.findIndex(
    (list) => list.level === spellToAdd.level,
  );

  if (levelListIndex === -1) {
    return [
      ...updatedSpellList,
      { level: spellToAdd.level, spells: [spellToAdd] },
    ];
  }

  const levelSpellList = updatedSpellList[levelListIndex];
  const spells = [...levelSpellList.spells];

  const spellIndex = spells.findIndex(
    (spell) => spell.name === spellToAdd.name,
  );

  if (spellIndex === -1) {
    spells.push(spellToAdd);
    updatedSpellList[levelListIndex] = { ...levelSpellList, spells };

    return updatedSpellList;
  }

  const spellAlreadyPresent = spells[spellIndex];

  if (modificationIsApplied(spellAlreadyPresent.trackModifications, modId)) {
    return updatedSpellList;
  }

  spells[spellIndex] = {
    ...spellAlreadyPresent,
    isAlwaysPrepared: true,
    isPrepared: false,
    trackModifications: [
      ...spellAlreadyPresent.trackModifications,
      ...spellToAdd.trackModifications,
    ],
  };

  updatedSpellList[levelListIndex] = { ...levelSpellList, spells };
  return updatedSpellList;
}

function removeSpellFromList(
  spellList: SpellLevelInterface[],
  modSpell: SpellNameAndLevel,
  modId: string,
): SpellLevelInterface[] {
  const updatedSpellList = [...spellList];

  const levelListIndex = updatedSpellList.findIndex(
    (list) => list.level === modSpell.level,
  );

  if (levelListIndex === -1) {
    devConsoleWarn(
      `Couldn't find the level ${modSpell.level} spell list to remove the spell`,
      updatedSpellList,
    );
    return updatedSpellList;
  }

  const levelSpellList = updatedSpellList[levelListIndex];

  const spells = [...levelSpellList.spells];

  const spellIndex = spells.findIndex((spell) => spell.name === modSpell.name);

  if (spellIndex === -1) {
    devConsoleWarn(
      `Couldn't find the spell "${modSpell.name}" in the list to remove it`,
      spells,
    );
    return updatedSpellList;
  }

  const spellToRemove = spells[spellIndex];

  const updatedTrackModifications = removeFromTrackModificationsById(
    spellToRemove,
    modId,
  );

  if (
    relatedModStillActive(updatedTrackModifications, addSpellToSpellListSet)
  ) {
    spells[spellIndex] = {
      ...spellToRemove,
      trackModifications: updatedTrackModifications,
    };
  } else {
    spells.splice(spellIndex, 1);
  }

  updatedSpellList[levelListIndex] = { ...levelSpellList, spells };
  return updatedSpellList;
}

function onAddingSpellToClassSpellList(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addSpellToClassSpellList" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  const thisModification: Extract<
    TrackModifications,
    { type: "addSpellToClassSpellList" }
  > = {
    name: mod.name,
    type: mod.type,
    source: mod.source,
    id: modId,
  };

  const levelSpellList = ruleSpellList.find(
    (list) => list.level === mod.spell.level,
  );

  if (!levelSpellList) {
    devConsoleWarn(
      `Couldn't find level ${mod.spell.level} from the rule spells list`,
      ruleSpellList,
    );
    return target;
  }

  let spellToAdd = levelSpellList.spells.find(
    (spell) => spell.name === mod.spell.name,
  );

  if (!spellToAdd) {
    devConsoleWarn(
      `couldn't find the spell ${mod.spell.name} in the list of the spells`,
      levelSpellList,
    );
    return target;
  }

  spellToAdd = {
    ...spellToAdd,
    isAlwaysPrepared: true,
    isPrepared: false,
    trackModifications: [thisModification],
  };

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    return {
      ...characterClass,
      spellcasting: {
        ...characterClass.spellcasting,
        spellList: addSpellToList(
          characterClass.spellcasting.spellList,
          spellToAdd,
          modId,
        ),
      },
    };
  });
}

function onRemovingSpellToClassSpellList(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addSpellToClassSpellList" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    return {
      ...characterClass,
      spellcasting: {
        ...characterClass.spellcasting,
        spellList: removeSpellFromList(
          characterClass.spellcasting.spellList,
          mod.spell,
          modId,
        ),
      },
    };
  });
}

function onAddingExtraCantripKnownToClass(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addExtraCantripKnownToClass" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  const thisModification: Extract<
    TrackModifications,
    { type: "addExtraCantripKnownToClass" }
  > = {
    name: mod.name,
    id: modId,
    type: mod.type,
    source: mod.source,
    classSpellList: mod.classSpellList,
    quantity: mod.quantity,
  };

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    const spellcasting = characterClass.spellcasting;

    if (modificationIsApplied(spellcasting.trackModifications, modId)) {
      return characterClass;
    }

    const extraCantrip = spellcasting.bonusCantripKnown
      ? spellcasting.bonusCantripKnown + mod.quantity
      : mod.quantity;

    return {
      ...characterClass,
      spellcasting: {
        ...spellcasting,
        bonusCantripKnown: extraCantrip,
        trackModifications: [
          ...spellcasting.trackModifications,
          thisModification,
        ],
      },
    };
  });
}

function onRemovingExtraCantripKnownToClass(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addExtraCantripKnownToClass" }>,
): RuleClass[] {
  const modId = getModificationId(mod);

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    const spellcasting = characterClass.spellcasting;

    if (!modificationIsApplied(spellcasting.trackModifications, modId)) {
      return characterClass;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      spellcasting,
      modId,
    );

    const updatedbonusCantripKnown = refactorCantripsKnown(
      updatedTrackModifications,
    );

    return {
      ...characterClass,
      spellcasting: {
        ...spellcasting,
        bonusCantripKnown: updatedbonusCantripKnown,
        trackModifications: updatedTrackModifications,
      },
    };
  });
}

export const spellcastingTypeResolver: SpellcastingTypeResolver = {
  addExchangeToSpellcasting: {
    apply: onAddingExchangeToSpellcasting,
    revert: onRemovingExchangeToSpellcasting,
  },
  addClassSpellList: {
    apply: onAddingClassSpellList,
    revert: onRemovingClassSpellList,
  },
  addSpellToClassSpellList: {
    apply: onAddingSpellToClassSpellList,
    revert: onRemovingSpellToClassSpellList,
  },
  addExtraCantripKnownToClass: {
    apply: onAddingExtraCantripKnownToClass,
    revert: onRemovingExtraCantripKnownToClass,
  },
};
