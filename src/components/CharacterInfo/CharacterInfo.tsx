import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { useCharacterContext } from "../../context/CharacterContext";
import { CharacterSingleInfo } from "./CharacterSingleInfo";

export function CharacterInfo(): JSX.Element {
  const { t } = useTranslation();
  const character = useCharacterContext();

  return (
    <div className="character-info-container">
      <div className="character-info-details">
        <CharacterSingleInfo
          whichInfo={"characterName"}
          needTranslation={false}
          characterInfo={character.name}
        />
        <CharacterSingleInfo
          whichInfo="background"
          needTranslation={false}
          characterInfo={"Sage"}
        />
        <CharacterSingleInfo
          whichInfo="species"
          needTranslation={false}
          characterInfo={"Tiefling"}
        />
        <CharacterSingleInfo
          whichInfo="class"
          needTranslation={false}
          characterInfo={"Monk"}
        />
      </div>
    </div>
  );
}
