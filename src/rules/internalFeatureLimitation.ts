import type { HasDisadvantageProperty } from "../types/generalRules.types";

export interface InternalFeatureLimitationMap {
  hasDisadvantage: { feature: HasDisadvantageProperty };
}

export type InternalFeatureLimitationResolver = {
  [K in keyof InternalFeatureLimitationMap]: (
    feature: InternalFeatureLimitationMap[K]["feature"],
  ) => boolean;
};

function hasDisadvantage(feature: HasDisadvantageProperty): boolean {
  return feature.hasDisadvantage;
}

export const internalFeatureLimitationResolver: InternalFeatureLimitationResolver =
  {
    hasDisadvantage: hasDisadvantage,
  };

export function isBlockedByInternalFeatureLimitation(
  feature: InternalFeatureLimitationMap[keyof InternalFeatureLimitationMap]["feature"],
  limitation: (keyof InternalFeatureLimitationMap)[],
): boolean {
  for (const limit of limitation) {
    if (internalFeatureLimitationResolver[limit](feature)) {
      return true
    }
  }
  return false;
}
