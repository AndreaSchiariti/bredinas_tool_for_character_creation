import type { Character } from "../types/character.types";
import type {
  CharacterArmorClass,
  CharacterSpeed,
  CharacterUnarmedStrike,
  Hp,
  SkillProp,
  TurnEconomyProp,
} from "../types/characterUtils.type";
import type { CountersInterface } from "../types/counters.types";
import type { ShieldInterface, WeaponInterface } from "../types/items.types";
import type { IsCuringCondition } from "./arrayOfFeatures";

export interface DirectTargetMap {
  unarmedStrike: CharacterUnarmedStrike;
  counters: CountersInterface[];
  bonusActions: TurnEconomyProp[];
  reactions: TurnEconomyProp[];
  freeActions: TurnEconomyProp[];
  mainHand: WeaponInterface | ShieldInterface | null;
  offHand: WeaponInterface | ShieldInterface | null;
  classArmor: CharacterArmorClass;
  speed: CharacterSpeed;
  hitPoints: Hp;
  isCuringCondition: IsCuringCondition;
  skills: SkillProp[]
}

type DirectTargetResolver = {
  [K in keyof DirectTargetMap]: (
    character: Character,
  ) => DirectTargetMap[K];
};

export const directTargetResolver: DirectTargetResolver = {
  unarmedStrike: (character: Character) => character.unarmedStrike,
  counters: (character: Character) => character.counters,
  bonusActions: (character: Character) => character.turnEconomy.bonusActions,
  reactions: (character: Character) => character.turnEconomy.reactions,
  freeActions: (character: Character) => character.turnEconomy.freeActions,
  mainHand: (character: Character) => character.equipped.mainHand,
  offHand: (character: Character) => character.equipped.offHand,
  classArmor: (character: Character) => character.armorClass,
  speed: (character: Character) => character.speed,
  hitPoints: (character: Character) => character.hp,
  isCuringCondition: (character: Character) => character.conditions.isCuringCondition,
  skills: (character: Character) => character.skills
};
