import type { JSX } from "react";
import { useCharacterContext } from "../../context/CharacterContext";
import { useTranslation } from "react-i18next";

export function HeroicInspirationBox () :JSX.Element {
    const character = useCharacterContext()
    const {t} = useTranslation()

    return (
      <div className="heroic-inspiration-container grid-area-heroicInspiration">
        <h1 className="title-of-box inspiration-title">{t("heroicInspiration").toUpperCase()}</h1>
        <div className="very-small-horizontal-line bg-color-text inspiration-line" />
        <div className="inspiration-value-box">
            <div className={`inspiration-value ${character.isInspired ? "is-inspired" : ""}`}></div>
        </div>
      </div>
    );
}