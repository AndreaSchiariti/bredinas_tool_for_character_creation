import type { Character } from "../../../types/character.types/character.types";
import type { CountersInterface } from "../../../types/modifications.types/counters.types";
import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";
import { getModificationId } from "../../calculationsAndBuilders/idBuilder";


export function onRemovingCounter(
  _character: Character,
  target: CountersInterface[],
  mod: ModificationsProp,
): CountersInterface[] {
  return target.filter(
    (counter: CountersInterface) => counter.id !== getModificationId(mod),
  );
}
