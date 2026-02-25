import type { CharacterModifications, ClassFeatureDescription } from "../../../types/ruleClass.types/ruleClassUtils.types";
import type { TargetInterface, ModifyTarget } from "../../../types/targets.types/targets.types";

const modification: CharacterModifications = {
  name: "",
  level: 1,
  description: [],
  modifications: [],
};

// DESCRIPTION ITEMS

const descriptionGeneral: ClassFeatureDescription = {
  content: "",
  type: "general",
};

const descriptionParagraph: ClassFeatureDescription = {
  content: "",
  type: "paragraphGeneral",
};

const descriptionList: ClassFeatureDescription = {
  content: "",
  type: "list",
};

const descriptionSubfeature: ClassFeatureDescription = {
  name: "",
  content: "",
  type: "subfeature",
};

// TARGETS ITEM

const directTargetItem: TargetInterface = {
  target: "unarmedStrike",
  type: "direct",
};

const directTargetWithModItem: TargetInterface = {
  target: "unarmedStrike",
  type: "direct",
  targetMod: [],
};

const conditionalTargetItem: TargetInterface = {
  target: "classLevel",
  type: "conditional",
  condition: "",
};

const conditionalTargetWithModItem: TargetInterface = {
  target: "classLevel",
  type: "conditional",
  condition: "",
  targetMod: [],
};

// TargetMod

const multiplyDiceCountMod: Extract<
  ModifyTarget,
  { type: "multiplyDiceCount" }
> = {
  type: "multiplyDiceCount",
  multiplier: 0,
};

const multiplyValueMod: Extract<ModifyTarget, { type: "multiplyValue" }> = {
  type: "multiplyValue",
  multiplier: 0,
};

// CommonClass Features:

const abilityScoreImprovementCF: CharacterModifications = {
  name: "abilityScoreImprovement",
  level: 4,
  description: [
    {
      content: "abilityScoreImprovementbarbarian",
      type: "general",
    },
  ],
  modifications: [
    {
      name: "abilityScoreImprovement",
      type: "addFeat",
      source: "cleric",
      level: 4,
      targets: [{ target: "feats", type: "direct" }],
      isActive: false,
    },
  ],
};

const epicBoonCF: CharacterModifications = {
  name: "epicBoon",
  level: 19,
  description: [
    {
      content: "barbarianEpicBoon",
      type: "general",
    },
  ],
  modifications: [
    {
      name: "abilityScoreImprovement",
      type: "addFeat",
      source: "cleric",
      level: 19,
      targets: [{ target: "feats", type: "direct" }],
      isActive: false,
    },
  ],
};

const spellcastingCF: CharacterModifications = {
  name: "spellcasting",
  level: 1,
  description: [
    {
      content: "clericSpellcasting",
      type: "general",
    },
    {
      name: "cantrips",
      content: "firstclericCantripsDescription",
      type: "subfeature",
    },
    {
      content: "secondclericCantripsDescription",
      type: "paragraphGeneral",
    },
    {
      content: "thirdclericCantripsDescription",
      type: "paragraphGeneral",
    },
    {
      name: "spellSlots",
      content: "clericSpellSlotsDescription",
      type: "subfeature",
    },
    {
      name: "preparedSpellsOfLevel1+",
      content: "firstclericPreparedSpellsOfLevel1+Description",
      type: "subfeature",
    },
    {
      content: "secondclericPreparedSpellsOfLevel1+Description",
      type: "paragraphGeneral",
    },
    {
      content: "thirdclericPreparedSpellsOfLevel1+Description",
      type: "paragraphGeneral",
    },
    {
      name: "changingYourPreparedSpells",
      content: "clericChangingYourPreparedSpellsDescription",
      type: "subfeature",
    },
    {
      name: "spellcastingAbility",
      content: "clericSpellcastingAbilityDescription",
      type: "subfeature",
    },
    {
      name: "spellcastingFocus",
      content: "clericSpellcastingFocusDescription",
      type: "subfeature",
    },
  ],
  modifications: [
    {
      name: "cantrips",
      type: "addValueBasedOnLevelCounter",
      source: "cleric",
      valueOnLevel: {
        level1: 2,
        level2: 2,
        level3: 2,
        level4: 3,
        level5: 3,
        level6: 3,
        level7: 3,
        level8: 3,
        level9: 3,
        level10: 4,
        level11: 4,
        level12: 4,
        level13: 4,
        level14: 4,
        level15: 4,
        level16: 4,
        level17: 4,
        level18: 4,
        level19: 4,
        level20: 4,
      },
      levelRef: {
        target: "classLevel",
        type: "conditional",
        condition: "cleric",
      },
      targets: [{ target: "counters", type: "direct" }],
      isActive: false,
    },
    {
      name: "preparedSpells",
      type: "addValueBasedOnLevelCounter",
      source: "cleric",
      valueOnLevel: {
        level1: 4,
        level2: 5,
        level3: 6,
        level4: 7,
        level5: 9,
        level6: 10,
        level7: 11,
        level8: 12,
        level9: 14,
        level10: 15,
        level11: 16,
        level12: 16,
        level13: 17,
        level14: 17,
        level15: 18,
        level16: 18,
        level17: 19,
        level18: 20,
        level19: 21,
        level20: 22,
      },
      levelRef: {
        target: "classLevel",
        type: "conditional",
        condition: "cleric",
      },
      targets: [{ target: "counters", type: "direct" }],
      isActive: false,
    },
  ],
};
