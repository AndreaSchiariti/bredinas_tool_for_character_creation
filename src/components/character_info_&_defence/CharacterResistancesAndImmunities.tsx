import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import type { DamageTypeProp } from "../../types/character_utils";

import { BoxWithTitle } from "../BowWithTitle";

interface ResistancesAndImmunities {
  type: "resistances" | "immunities" | "vulnerabilities";
  typeArray: DamageTypeProp[];
}

export function CharacterResistancesAndImmunities({
  type,
  typeArray,
}: ResistancesAndImmunities): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`grid-area-${type} resistance-and-immunities`}>
      <BoxWithTitle title={`${type}`}>
        {" "}
        <div className="flex-v-centered">
          {typeArray.map((resistanceOrImmunity) => (
            <p key={resistanceOrImmunity.type}>
              {t(resistanceOrImmunity.type)}
            </p>
          ))}
        </div>
      </BoxWithTitle>
    </div>
  );
}
