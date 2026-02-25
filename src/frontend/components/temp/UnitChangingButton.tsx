import type { JSX } from "react";
import type { Units } from "../../../backend/types/character.types/characterUtils.type";
import { useTranslation } from "react-i18next";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";

interface UnitButton {
  unit: Units;
}

export function UnitChangingButton({ unit }: UnitButton): JSX.Element {
  const { t } = useTranslation();
  const { onChangePreferredUnit } = useUserPreferencesContext();

  return (
    <button
      onClick={(): void => onChangePreferredUnit(unit)}
      className="temp-button"
    >
      {t(unit)}
    </button>
  );
}
