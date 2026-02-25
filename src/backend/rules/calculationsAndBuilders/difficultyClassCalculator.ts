export function calculateAbilityDC(
  modifier: number,
  proficiency: number,
): number {
  return 8 + proficiency + modifier;
}

export interface DifficultyClassCalculatorMap {
  relentlessRage: (relentlessRageCount: number) => number;
}

type DifficultyClassCalculatorResolver = {
  [K in keyof DifficultyClassCalculatorMap]: DifficultyClassCalculatorMap[K];
};

function calculateRelentlessRageDc(relentlessRageCount: number): number {
  if (relentlessRageCount <= 1) {
    return 10;
  }

  return (relentlessRageCount - 1) * 5 + 10;
}

export const difficultyClassCalculator: DifficultyClassCalculatorResolver = {
  relentlessRage: calculateRelentlessRageDc,
};
