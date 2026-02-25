import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function LanguageToggleButton(): JSX.Element {
  const { i18n } = useTranslation();

  function onChangeLanguage(): void {
    const changedLanguage = i18n.resolvedLanguage === "en" ? "it" : "en";
    i18n.changeLanguage(changedLanguage);
  }

  return <button className="temp-button" onClick={onChangeLanguage}>{i18n.resolvedLanguage}</button>;
}
