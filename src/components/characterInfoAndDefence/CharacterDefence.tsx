import { useMemo, type JSX } from "react";
import type { DamageTypeProp } from "../../types/characterUtils.type";
import { CharacterArmorClass } from "./CharacterArmorClass";
import { useCharacterContext } from "../../context/CharacterContext";
import { CharacterResistancesAndImmunities } from "./CharacterResistancesAndImmunities";
import { CharacterHitPoints } from "./CharacterHitPoints";
import { CharacterHitDice } from "./CharacterHitDice";

export function CharacterDefence(): JSX.Element {
  const character = useCharacterContext();

  const immunities = useMemo<DamageTypeProp[]>(() => {
    return character.damageResistances.filter((immunity) => immunity.isImmune);
  }, [character]);

  const resistances = useMemo<DamageTypeProp[]>(() => {
    return character.damageResistances.filter(
      (resistance) => resistance.isResistant && !resistance.isImmune,
    );
  }, [character]);

  const vulnerabilities = useMemo<DamageTypeProp[]>(() => {
    return character.damageResistances.filter(
      (vulnerability) => vulnerability.isVulnerable,
    );
  }, [character]);

  return (
    <div className="character-defence-container">
      <CharacterHitPoints />
      <CharacterHitDice />
      <CharacterArmorClass />
      <CharacterResistancesAndImmunities
        type="resistances"
        typeArray={resistances}
      />
      <CharacterResistancesAndImmunities
        type="immunities"
        typeArray={immunities}
      />
      <CharacterResistancesAndImmunities
        type="vulnerabilities"
        typeArray={vulnerabilities}
      />
    </div>
  );
}
