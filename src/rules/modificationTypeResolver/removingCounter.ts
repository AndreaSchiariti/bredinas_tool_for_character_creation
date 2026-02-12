import type { Character } from "../../types/character.types";
import type { CountersInterface } from "../../types/counters.types";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import { getModificationId } from "../idBuilder";

export function onRemovingCounter(
  _character: Character,
  target: CountersInterface[],
  mod: ModificationsProp,
): CountersInterface[] {
  return target.filter(
    (counter: CountersInterface) => counter.id !== getModificationId(mod),
  );
}