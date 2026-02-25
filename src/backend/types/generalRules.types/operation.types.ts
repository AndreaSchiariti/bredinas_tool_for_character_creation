export const operations = ["add", "subtract", "multiply", "divide"] as const;

export type Operation = (typeof operations)[number];

export interface ModifyValue {
  operation: Operation;
  value: number;
}

export interface HasAdvantageAndDisadvantageProperty {
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
}
