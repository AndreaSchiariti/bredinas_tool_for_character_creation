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
};
