import type { CharacterSpeed, Units } from "../types/character_utils";

export function convertMetersToFeet(meters: number): number {
  return Math.floor((meters / 3) * 10);
}

export function convertMetersToSquares(meters: number): number {
  return Math.floor((meters / 3) * 2);
}

export function convertFeetToMeters(feet: number): number {
  return Math.floor((feet * 3) / 10);
}

export function convertFeetToSquares(feet: number): number {
  return Math.floor(feet / 5);
}

export function convertSquaresToMeters(squares: number): number {
  return Math.floor((squares * 3) / 2);
}

export function convertSquaresToFeet(squares: number): number {
  return squares * 5;
}

export function renderPreferedUnit(preferedUnit : Units, unitsArray : CharacterSpeed[]) : CharacterSpeed {
 const foundUnit = unitsArray.find(unitToFind => unitToFind.unit === preferedUnit)

 if (!foundUnit) {
  throw new Error(`${preferedUnit} is missing`)
 }

 return foundUnit
}