import type { Character } from "../types/character.types";
import type {
  CharacterAttacks,
  CharacterBardicInspiration,
} from "../types/characterUtils.type";
import {
  isAddValueToAttacksBasedOnAbilityWithoutTracker,
  type ConditionEventProp,
} from "../types/ConditionEventProp.type";
import type { Ability } from "../types/features.type.ts/abilitiesAndSkills.type";
import { isConditionProp } from "../types/features.type.ts/conditions.type";
import type { DamageTypeProp } from "../types/features.type.ts/damageTypes.type";
import type { CharacterSpellcasting } from "../types/features.type.ts/spells.type";
import { hasValueProperty } from "../types/generalGuardingFunction";
import { devConsoleWarn } from "../utils/general";
import {
  changeBackCanCastCheckingModifications,
  changeAllCanCastComponent,
  relatedModStillActive,
  addResistanceSet,
  modificationIsApplied,
} from "./characterCalculations";
import {
  getConditionEventId,
  removeFromTrackModificationsById,
} from "./idBuilder";
import { getTarget } from "./modificationsExecution";

export interface ConditionEventTypeMap {
  addResistanceConditionEvent: {
    character: Character;
    target: DamageTypeProp[];
    event: Extract<ConditionEventProp, { type: "addResistanceConditionEvent" }>;
  };
  addValueToAttacksBasedOnAbilityConditionEvent: {
    character: Character;
    target: CharacterAttacks[];
    event: Extract<
      ConditionEventProp,
      { type: "addValueToAttacksBasedOnAbilityConditionEvent" }
    >;
  };
  stopConcentrationAndSpellcasting: {
    character: Character;
    target: CharacterSpellcasting | null;
    event: Extract<
      ConditionEventProp,
      { type: "stopConcentrationAndSpellcastingConditionEvent" }
    >;
  };
  addBardicInspirationDice: {
    character: Character;
    target: CharacterBardicInspiration;
    event: Extract<ConditionEventProp, { type: "addBardicInspirationDice" }>;
  };
}

type ConditionEventTypeResolver = {
  [K in keyof ConditionEventTypeMap]: (
    Character: Character,
    target: ConditionEventTypeMap[K]["target"],
    event: ConditionEventTypeMap[K]["event"],
  ) => ConditionEventTypeMap[K]["target"];
};

function onAddingResistancesConditionEvent(
  character: Character,
  target: DamageTypeProp[],
  event: Extract<ConditionEventProp, { type: "addResistanceConditionEvent" }>,
): DamageTypeProp[] {
  const conditionRef = getTarget(character, event.activeConditionRef);

  if (!isConditionProp(conditionRef)) {
    devConsoleWarn(`The condition ref is not a conditionProp`, conditionRef);
    return target;
  }

  const conditionAffecting = conditionRef.isAffecting;

  const eventId = getConditionEventId(event);

  const resistancesSet = new Set(event.addResistancesTo);

  return target.map((damageType) => {
    if (!resistancesSet.has(damageType.type)) {
      return damageType;
    }

    let updatedTrackModification = [...damageType.trackModifications];

    if (conditionAffecting) {
      const notAlreadyAdded = modificationIsApplied(
        damageType.trackModifications,
        eventId,
      );

      if (notAlreadyAdded) {
        updatedTrackModification = [
          ...updatedTrackModification,
          {
            name: conditionRef.name,
            id: eventId,
            source: conditionRef.name,
            type: event.type,
          },
        ];
      }
    }

    if (!conditionAffecting) {
      updatedTrackModification = updatedTrackModification.filter(
        (mod) => mod.id !== eventId,
      );
    }

    const isStillResistant = relatedModStillActive(
      damageType.trackModifications,
      addResistanceSet,
    );

    return {
      ...damageType,
      isResistant: isStillResistant,
      trackModifications: updatedTrackModification,
    };
  });
}

function onAddingValueToAttacksBasedOnAbilityConditionEvent(
  character: Character,
  target: CharacterAttacks[],
  event: Extract<
    ConditionEventProp,
    { type: "addValueToAttacksBasedOnAbilityConditionEvent" }
  >,
): CharacterAttacks[] {
  let value = 0;

  if (isAddValueToAttacksBasedOnAbilityWithoutTracker(event)) {
    value = event.value;
  } else {
    const fetchedValue = getTarget(character, event.valueToFetch);

    if (!hasValueProperty(fetchedValue)) {
      devConsoleWarn(`The fetched target has no value property`, fetchedValue);
      return target;
    }
    value = fetchedValue.value;
  }

  const abilitiesAffectedSet = new Set<Ability>(event.ability);

  const conditionRef = getTarget(character, event.activeConditionRef);

  if (!isConditionProp(conditionRef)) {
    devConsoleWarn(`The condition Ref must be a ConditionProp`, conditionRef);
    return target;
  }

  const isAffecting = conditionRef.isAffecting;

  const eventId = getConditionEventId(event);

  return target.map((attack) => {
    if (!abilitiesAffectedSet.has(attack.abilityUsed)) {
      return attack;
    }

    const registeredModification = attack.trackModifications.find(
      (mod) => mod.id === eventId,
    );

    const isInTrackedModification = !!registeredModification;

    if (!isAffecting) {
      if (!isInTrackedModification) {
        return attack;
      }

      if (!hasValueProperty(registeredModification)) {
        devConsoleWarn(
          `The tracked modification should have value property`,
          registeredModification,
        );
        return attack;
      }

      return {
        ...attack,
        addingValues: attack.addingValues - registeredModification.value,
        trackModifications: removeFromTrackModificationsById(attack, eventId),
      };
    }

    if (isInTrackedModification) {
      if (!hasValueProperty(registeredModification)) {
        devConsoleWarn(
          `The tracked modification should have value property`,
          registeredModification,
        );
        return attack;
      }

      const delta = value - registeredModification.value;
      return { ...attack, addingValues: attack.addingValues + delta };
    }

    return {
      ...attack,
      addingValues: attack.addingValues + value,
      trackModifications: [
        ...attack.trackModifications,
        {
          name: event.activeConditionRef.condition,
          type: event.type,
          source: event.activeConditionRef.condition,
          id: eventId,
          value: value,
        },
      ],
    };
  });
}

function onStoppingConcentrationAndSpellcastingConditionEvent(
  character: Character,
  target: CharacterSpellcasting | null,
  event: Extract<
    ConditionEventProp,
    { type: "stopConcentrationAndSpellcastingConditionEvent" }
  >,
): CharacterSpellcasting | null {
  if (!target) {
    return null;
  }

  const conditionRef = getTarget(character, event.activeConditionRef);

  if (!isConditionProp(conditionRef)) {
    devConsoleWarn(
      `To stop Concentration and Spellcasting the conditionRef must be a ConditionProp`,
      conditionRef,
    );
    return target;
  }

  const isAffecting = conditionRef.isAffecting;

  const eventId = getConditionEventId(event);

  const isAlreadyApplied = target.trackModifications.some(
    (mod) => mod.id === eventId,
  );

  if (!isAffecting) {
    if (!isAlreadyApplied) {
      return target;
    }

    const updatedTrackModification = removeFromTrackModificationsById(
      target,
      eventId,
    );

    return {
      ...target,
      canCast: changeBackCanCastCheckingModifications(updatedTrackModification),
      trackModifications: updatedTrackModification,
    };
  }

  if (isAlreadyApplied) {
    return target;
  }

  return {
    ...target,
    isConcentration: false,
    canCast: changeAllCanCastComponent(false),
    trackModifications: [
      ...target.trackModifications,
      {
        id: eventId,
        type: event.type,
        source: event.activeConditionRef.condition,
        name: event.activeConditionRef.condition,
      },
    ],
  };
}

function onAddingBardicInspirationDice(
  character: Character,
  target: CharacterBardicInspiration,
  event: Extract<ConditionEventProp, { type: "addBardicInspirationDice" }>,
): CharacterBardicInspiration {
  const conditionRef = getTarget(character, event.activeConditionRef);

  if (!isConditionProp(conditionRef)) {
    devConsoleWarn(
      `The condition ref must be a Condition Prop when adding bardic inspiration dice`,
      conditionRef,
    );
    return target;
  }

  const isActive = conditionRef.isAffecting;

  if (!isActive) {
    return { isDiceSelectorIsShown: false, dice: undefined, isShown: undefined };
  }

  if (target.dice !== undefined) {
    return target
  }

  return {isDiceSelectorIsShown: true, dice : undefined, isShown: undefined}
}

export const conditionEventTypeResolver: ConditionEventTypeResolver = {
  addResistanceConditionEvent: onAddingResistancesConditionEvent,
  addValueToAttacksBasedOnAbilityConditionEvent:
    onAddingValueToAttacksBasedOnAbilityConditionEvent,
  stopConcentrationAndSpellcasting:
    onStoppingConcentrationAndSpellcastingConditionEvent,
    addBardicInspirationDice: onAddingBardicInspirationDice
};
