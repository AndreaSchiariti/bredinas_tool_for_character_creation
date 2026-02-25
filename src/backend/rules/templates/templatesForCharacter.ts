export const characterHP = {
  basicMax: 8,
  currentMax: 8,
  current: 8,
  temp: 0,
  hitDices: []
};

export const characterHitDices = {
  numberOfDices: 1,
  typeOfDice: "d8"
}

export const trackedModification = {
  source: null,
  target: null,
  operation: null,
  value: null,
};

export const characterSpeed = {
  unit: "meters",
  baseScore: 9,
  currentScore: 9,
  trackModifications: [],
};

export const characterArmorClass = {
  baseScore: 10,
  currentScore: 10,
  trackModifications: [],
};

export const characterInitiative = {
  baseScore: 0,
  currentScore: 0,
  ability: "dexterity",
  trackModifications: [],
  isWearingLightArmor: false,
  isWearingMediumArmor: false,
  isWearingHeavyArmor: false
};

export const characterClass = {
  name: "",
  subclass : "",
  primaryAbility: "",
  hitDie: "",
  savingThrowProficiency: [],
  weaponProficiency: [],
  skillProficiency: {
    choosingNumber: 0,
    skills: []
  },
  toolProficiency: [],
  armorTraining: [],
  startingEquipment: {
    a : [],
    b: []
  },
  classFeature: [],
  spellcasting:[],
  becomingClass: {
    level1: [],
    multiclass: []
  },
  counters : []
}

export const classFeature = {
  name : "",
  description: [],
  modification: "",
  modificationChangableValue: 0,
  affects: [],
  limitations: [],
  show: false
}

export const classFeatureDescription = {
  type : "",
  content1: "",
  content2: ""
}

export const diceCounterTemplate = {
  name: "",
  id: "",
  type: "dice",
  dice: "",
  source : ""
}

export const tracerCounterTemplate = {
  name: "",
  id: "",
  type: "tracer",
  maxQuantity: 0,
  currentQuantity: 0,
  replanish: "",
  source: "",
};

export const itemWeapon = {
  name: "",
  type: "weapon",
  subType: "",
  costValue: 0,
  costCurrency: "",
  weight: 0,
  description: "",
  properties: [],
  range: [],
  mastery: [],
  damageBaseDice: "",
  currentDice: "",
  trackModifications: []
}

export const economyProp = {
  name: "",
  description: "",
  isShown: false,
}