export function makeStringGuard<T extends string>(set: ReadonlySet<T>) {
  return (value: unknown): value is T =>
    typeof value === "string" && set.has(value as T);
}
