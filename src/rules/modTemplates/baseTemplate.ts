import type {
  CharacterModifications,
  ClassFeatureDescription,
} from "../../types/characterClassesUtils.types";
import type { ModifyTarget, TargetInterface } from "../../types/targets.types";

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
      source: "barbarian",
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
      source: "barbarian",
      level: 19,
      targets: [{ target: "feats", type: "direct" }],
      isActive: false,
    },
  ],
};