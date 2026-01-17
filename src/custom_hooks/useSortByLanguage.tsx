import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface UseSortByLanguageHook<T> {
  sortArrayOfStrings: (array: string[]) => string[];
  sortArrayOfObjects: <K extends keyof T>(array: T[], key: K) => T[];
}

export function useSortArrayByLanguage<T>(): UseSortByLanguageHook<T> {
  const { i18n, t } = useTranslation();

  const collator = new Intl.Collator(i18n.language);

  const sortArrayOfStrings = useCallback((array: string[]): string[] => {
    return [...array].sort((a, b) => collator.compare(t(a), t(b)));
  }, [i18n.language])

  const sortArrayOfObjects = useCallback(<K extends keyof T>(array: T[], key: K): T[] => {
    return [...array].sort((a, b) => collator.compare(t(String(a[key])), t(String(b[key]))));
  }, [i18n.language])

  return {
    sortArrayOfObjects,
    sortArrayOfStrings,
  };
}
