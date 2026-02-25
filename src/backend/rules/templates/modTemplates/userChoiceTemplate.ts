import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";

const addProficiencyWithChoiceMod: Extract<
  ModificationsProp,
  { type: "addProficiencyWithChoice" }
> = {
  name: "primalKnowledge",
  type: "addProficiencyWithChoice",
  targets: [{ target: "skills", type: "direct" }],
  skillsToChoose: [
    "animalHandling",
    "athletics",
    "intimidation",
    "nature",
    "perception",
    "survival",
  ],
  howMany: 1,
  source: "cleric",
  isActive: false,
};

const addExpertiseWithChoiceMod: Extract<
  ModificationsProp,
  { type: "addExpertiseToProficiencyWithChoice" }
> = {
  name: "expertise",
  type: "addExpertiseToProficiencyWithChoice",
  targets: [{ target: "skills", type: "direct" }],
  howMany: 2,
  source: "cleric",
  isActive: false,
};

const addClassChoiceMod: Extract<
  ModificationsProp,
  { type: "addClassChoice" }
> = {
  name: "",
  type: "addClassChoice",
  source: "cleric",
  targets: [{ target: "classes", type: "direct" }],
  class: "cleric",
  choice: {
    key: "divineOrder",
    options: [
      {
        name: "protector",
        content: "protectorDivineOrderDescription",
      },
      {
        name: "thaumaturge",
        content: "thaumaturgeDivineOrderDescription",
      },
    ],
  },
  isActive: false,
};
