import type { JSX } from "react";
import { useCharacterContext } from "../../context/CharacterContext";
import { CharacterSingleInfo } from "./CharacterSingleInfo";
;

export function CharacterInfo(): JSX.Element {
  const character = useCharacterContext();

  return (
    <div className="character-info-container">
      <div className="character-info-details">
        <CharacterSingleInfo
          whichInfo={"characterName"}
          gridArea={"name"}
          characterInfo={character.name}
          flexAlign="start"
          className="character-generic-info"
        />
        <CharacterSingleInfo
          whichInfo="background"
          gridArea={"bg"}
          characterInfo={"Sage"}
          flexAlign="start"
          className="character-generic-info"
        />
        <CharacterSingleInfo
          whichInfo="species"
          gridArea={"species"}
          characterInfo={"Tiefling"}
          flexAlign="start"
          className="character-generic-info"
        />
        <CharacterSingleInfo
          whichInfo="class"
          gridArea={"class"}
          characterInfo={"Monk"}
          flexAlign="start"
          className="character-generic-info"
        />
      </div>
      <div className="character-level-details">
        <CharacterSingleInfo
          whichInfo="level"
          characterInfo={`${character.level}`}
          flexAlign="center-between"
          className="character-generic-info"
        />
        <CharacterSingleInfo
          whichInfo="xp"
          characterInfo={`${character.xp}`}
          flexAlign="center-between"
          className="character-generic-info"
        />
      </div>
    </div>
  );
}
