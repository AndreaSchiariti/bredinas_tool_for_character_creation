import type { SpellComponents } from "../../../types/features.types/spells.type";
import { hasQuantityProperty, type TrackModificationWithQuantity } from "../../../types/guardingFunctions/trackModificationsGuards";
import type { TrackModifications,  } from "../../../types/modifications.types/trackModifications.types";
import { relatedModStillActive } from "./generalModFunctions";
import { somaticBlockerSet, verbalBlockerSet, materialBlockerSet, addCantripKnownSet } from "./modSets";


export function refactorCantripsKnown(
  trackModifications: TrackModifications[],
): number {
  const filteredTrackMod = trackModifications.filter(
    (mod): mod is TrackModificationWithQuantity =>
      hasQuantityProperty(mod) && addCantripKnownSet.has(mod.type),
  );

  return filteredTrackMod.reduce((acc, mod) => acc + mod.quantity, 0);
}

export function changeAllCanCastComponent(canCast: boolean): SpellComponents {
  return { somatic: canCast, verbal: canCast, material: canCast };
}

export function changeBackCanCastCheckingModifications(
  trackModifications: TrackModifications[],
): SpellComponents {
  const somatic = !relatedModStillActive(trackModifications, somaticBlockerSet);

  const verbal = !relatedModStillActive(trackModifications, verbalBlockerSet);

  const material = !relatedModStillActive(
    trackModifications,
    materialBlockerSet,
  );

  return { somatic, verbal, material };
}
