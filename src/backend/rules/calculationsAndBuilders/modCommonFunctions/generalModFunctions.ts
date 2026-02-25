import type { TrackModifications } from "../../../types/modifications.types/trackModifications.types";

export function modificationIsApplied(
  trackModifications: TrackModifications[],
  id: string,
): boolean {
  return trackModifications.some((mod) => mod.id === id);
}

export function relatedModStillActive(
  trackModifications: TrackModifications[],
  blockerSet: Set<TrackModifications["type"]>,
): boolean {
  return trackModifications.some((mod) => blockerSet.has(mod.type));
}