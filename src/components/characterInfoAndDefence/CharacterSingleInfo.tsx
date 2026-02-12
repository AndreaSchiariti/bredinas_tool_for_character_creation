import type { JSX } from "react";
import { useTranslation } from "react-i18next";

type Info =
  | "characterName"
  | "class"
  | "classes"
  | "background"
  | "species"
  | "level"
  | "xp"
  | "spent"
  | "max";

type CharacterSingleInfo = {
  characterInfo: string;
  whichInfo: Info;
  gridArea?: "name" | "class" | "bg" | "species";
  flexAlign: "start" | "center-between";
  className: string;
};

export function CharacterSingleInfo({
  characterInfo,
  whichInfo,
  gridArea,
  flexAlign,
  className,
}: CharacterSingleInfo): JSX.Element {
  const { t } = useTranslation();
  return (
    <div
      className={`flex-v-${flexAlign} ${
        gridArea ? `grid-area-${gridArea}` : ""
      } ${className} gap-4`}
    >
      <h1> {t(characterInfo)}</h1>
      <div className="very-small-horizontal-line bg-color-text"/>
      <p>{t(whichInfo).toUpperCase()}</p>
    </div>
  );
}
