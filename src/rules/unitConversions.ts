export function convertMetersToFeet(meters: number): number {
  return (meters / 3) * 10;
}

export function convertMetersToSquares(meters: number): number {
  return Math.floor((meters / 3) * 2);
}

export function convertFeetToMeters(feet: number): number {
  return Math.floor(feet * 3) / 10;
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
