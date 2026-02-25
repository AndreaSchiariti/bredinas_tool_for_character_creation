export function description(feature: string): string {
  return `${feature}Description`;
}



export function devConsoleWarn(warning: string, data: unknown) {
  if (import.meta.env.DEV) {
    console.warn(warning, data);
  }
}

export function removeFromArrayByIndex<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
