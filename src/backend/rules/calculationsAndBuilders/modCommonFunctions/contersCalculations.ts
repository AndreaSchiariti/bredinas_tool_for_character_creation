import type { CountersInterface } from "../../../types/modifications.types/counters.types";

export function counterAlreadyPresent(
  countersList: CountersInterface[],
  counterId: string,
): boolean {
  return countersList.some((counter) => counter.id === counterId);
}


