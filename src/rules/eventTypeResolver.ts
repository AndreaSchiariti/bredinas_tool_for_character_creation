import type { Character } from "../types/character.types";
import type {
  CharacterAttacks,
  CharacterReminder,
  Hp,
  IsHealing,
} from "../types/characterUtils.type";
import {
  hasReplenishMaxAndRemainingUses,
  isContinuousEventWithTriggerCounter,
  isReplanishableCounter,
  type CountersInterface,
} from "../types/counters.types";
import type {
  EventCounterProp,
  EventReturn,
} from "../types/EventCounterProp.type";
import { type CharacterSkills } from "../types/features.type.ts/abilitiesAndSkills.type";
import {
  type CharacterConditions,
  isCondition,
} from "../types/features.type.ts/conditions.type";
import type { DamageTypeProp } from "../types/features.type.ts/damageTypes.type";
import { hasDiceProperty, hasValueProperty, isTargetInterface } from "../types/generalGuardingFunction";
import { isDiceInterface } from "../types/generalRules.types";
import {
  hasDiceInterfaceAndNumbers,
  hasScoresWithTrackingProperty,
  type HasScoresWithTracking,
} from "../types/targets.types";
import {
  type TrackModifications,
} from "../types/trackModifications.types";
import { devConsoleWarn, removeFromArrayByIndex } from "../utils/general";
import {
  activateConditionSet,
  addAdvantageSet,
  addResistanceSet,
  calculateModifyValue,
  isSameDice,
  modificationIsApplied,
  relatedModStillActive,
} from "./characterCalculations";
import { isBlockedByInternalFeatureLimitation } from "./internalFeatureLimitation";
import { diceAndNumbersToString, getTarget } from "./modificationsExecution";

export interface EventTypeMap {
  replenishCounter: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "replenishCounter" }>;
  };
  replenishToValueCounter: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "replenishToValueCounter" }>;
  };
  heals: {
    character: Character;
    target: Hp;
    event: Extract<EventCounterProp, { type: "heals" }>;
  };
  trackerHeals: {
    character: Character;
    target: Hp;
    event: Extract<EventCounterProp, { type: "trackerHeals" }>;
  };
  cureOneCondition: {
    character: Character;
    target: CharacterConditions;
    event: Extract<EventCounterProp, { type: "cureOneCondition" }>;
  };
  useResource: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "useResource" }>;
  };
  addResistanceEvent: {
    character: Character;
    target: DamageTypeProp[];
    event: Extract<EventCounterProp, { type: "addResistanceEvent" }>;
  };
  activateConditionEvent: {
    character: Character;
    target: CharacterConditions;
    event: Extract<EventCounterProp, { type: "activateConditionEvent" }>;
  };
  addAdvantageEvent: {
    character: Character;
    target: CharacterAttacks[] | CharacterSkills;
    event: Extract<EventCounterProp, { type: "addAdvantageEvent" }>;
  };
  addReminderEvent: {
    character: Character;
    target: CharacterReminder[];
    event: Extract<EventCounterProp, { type: "addReminderEvent" }>;
  };
  addFetchedScoreEvent: {
    character: Character;
    target: HasScoresWithTracking;
    event: Extract<EventCounterProp, { type: "addFetchedScoreEvent" }>;
  };
  addDiceToAttackBasedOnAbilityEvent: {
    character: Character;
    target: CharacterAttacks[];
    event: Extract<
      EventCounterProp,
      { type: "addDiceToAttackBasedOnAbilityEvent" }
    >;
  };
}

type EventTypeResolver = {
  [K in keyof EventTypeMap]: (
    character: Character,
    target: EventTypeMap[K]["target"],
    event: EventTypeMap[K]["event"],
  ) => EventReturn<EventTypeMap[K]["target"]>;
};

function onReplenishEvent(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishCounter" }>,
): EventReturn<CountersInterface[]> {
  return {
    result: target.map((counter) => {
      if (isReplanishableCounter(counter) && counter.id === event.targetId) {
        return {
          ...counter,
          remainingUses: counter.maxUses,
        };
      }

      return counter;
    }),
  };
}

function onReplenishToValueEvent(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishToValueCounter" }>,
): EventReturn<CountersInterface[]> {
  return {
    result: target.map((counter) => {
      if (
        isReplanishableCounter(counter) &&
        counter.id === event.targetId &&
        counter.remainingUses < event.value
      ) {
        return {
          ...counter,
          remainingUses: event.value,
        };
      }

      return counter;
    }),
  };
}

function onHealEvent(
  _character: Character,
  target: Hp,
  _event: Extract<EventCounterProp, { type: "heals" }>,
): EventReturn<Hp> {
  const isShown: IsHealing = { isShown: true, information: "" };
  return { result: { ...target, isHealing: isShown } };
}

function onTrackerHealEvent(
  character: Character,
  target: Hp,
  event: Extract<EventCounterProp, { type: "trackerHeals" }>,
): EventReturn<Hp> {
  const diceToRoll = event.diceRoll.map((element) =>
    getTarget(character, element),
  );

  let isHealing: IsHealing = {
    isShown: true,
    information: event.message,
  };

  if (hasDiceInterfaceAndNumbers(diceToRoll)) {
    isHealing.value1 = diceAndNumbersToString(diceToRoll);
  } else {
    devConsoleWarn(
      `onTrackerHealEvent didn't fetch only numbers and strings`,
      diceToRoll,
    );
  }

  return { result: { ...target, isHealing } };
}

function onCuringOneCondition(
  _character: Character,
  target: CharacterConditions,
  event: Extract<EventCounterProp, { type: "cureOneCondition" }>,
): EventReturn<CharacterConditions> {
  if (!event.conditions.every(isCondition)) {
    devConsoleWarn(
      `The property "conditions" of the "cureOneCondition" is not compose only of conditions`,
      event,
    );
    return { result: target };
  }

  return {
    result: {
      ...target,
      isCuringCondition: { isShown: true, conditionsToCure: event.conditions },
    },
  };
}

function onUseResource(
  character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "useResource" }>,
): EventReturn<CountersInterface[]> {
  const counterRef = getTarget(character, event.resetCounterRef);
  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The counter ref is not a countinous event counter`,
      counterRef,
    );
    return { result: target };
  }

  if (event.resourcesToUse <= 0) {
    devConsoleWarn(
      `the Resources to Use must be bigger than 0`,
      event.resourcesToUse,
    );
    return { result: target };
  }

  const counterIndex = target.findIndex(
    (counter) => counter.id === event.targetId,
  );

  if (counterIndex === -1) {
    devConsoleWarn(`Counter with id ${event.targetId} not found`, target);
    return { result: target };
  }

  const counter = target[counterIndex];

  if (!hasReplenishMaxAndRemainingUses(counter)) {
    devConsoleWarn("The target needs a currentScore property", counter);
    return { result: target };
  }

  let updatedUsage = counter.remainingUses;

  if (counterRef.eventsStatus === "reset") {
    updatedUsage = counter.remainingUses + event.resourcesToUse;

    updatedUsage =
      counter.maxUses < updatedUsage ? counter.maxUses : updatedUsage;
  } else {
    if (counter.remainingUses < event.resourcesToUse) {
      return {
        result: target,
        message: { message: event.message, property: counter.name },
      };
    }

    updatedUsage = counter.remainingUses - event.resourcesToUse;
  }

  const updatedCounter = {
    ...counter,
    remainingUses: updatedUsage,
  };

  const updatedTarget = [...target];
  updatedTarget[counterIndex] = updatedCounter;

  return { result: updatedTarget };
}

function onAddingResistances(
  character: Character,
  target: DamageTypeProp[],
  event: Extract<EventCounterProp, { type: "addResistanceEvent" }>,
): EventReturn<DamageTypeProp[]> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The counter ref is not a countinous event counter`,
      counterRef,
    );
    return { result: target };
  }

  const eventActive = counterRef.eventsStatus === "active";

  const resistancesSet = new Set(event.addResistancesTo);

  return {
    result: target.map((damageType) => {
      if (!resistancesSet.has(damageType.type)) {
        return damageType;
      }

      let updatedTrackModification = [...damageType.trackModifications];

      if (eventActive) {
        const notAlreadyAdded = modificationIsApplied(damageType.trackModifications, counterRef.id);

        if (notAlreadyAdded) {
          updatedTrackModification = [
            ...updatedTrackModification,
            {
              name: counterRef.name,
              id: counterRef.id,
              source: counterRef.source,
              type: event.type,
            },
          ];
        }
      }

      if (!eventActive) {
        updatedTrackModification = updatedTrackModification.filter(
          (mod) => !(mod.id === counterRef.id && mod.type === event.type),
        );
      }

      const isStillResistant = relatedModStillActive(damageType.trackModifications, addResistanceSet);

      return {
        ...damageType,
        isResistant: isStillResistant,
        trackModifications: updatedTrackModification,
      };
    }),
  };
}

function onActivatingConditionEvent(
  character: Character,
  target: CharacterConditions,
  event: Extract<EventCounterProp, { type: "activateConditionEvent" }>,
): EventReturn<CharacterConditions> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The counter ref is not a countinous event counter`,
      counterRef,
    );
    return { result: target };
  }

  const eventActive = counterRef.eventsStatus === "active";

  const conditionToActivateSet = new Set(event.conditionsToActivate);

  return {
    result: {
      ...target,
      conditionsList: target.conditionsList.map((condition) => {
        if (!conditionToActivateSet.has(condition.name) || condition.isImmune) {
          return condition;
        }

        let updatedTrackModification = [...condition.trackModifications];

        if (eventActive) {
          const notAlreadyAdded = modificationIsApplied(condition.trackModifications, counterRef.id);

          if (notAlreadyAdded) {
            updatedTrackModification = [
              ...updatedTrackModification,
              {
                name: counterRef.name,
                id: counterRef.id,
                source: counterRef.source,
                type: event.type,
              },
            ];
          }
        }

        if (!eventActive) {
          updatedTrackModification = updatedTrackModification.filter(
            (mod) => !(mod.id === counterRef.id && mod.type === event.type),
          );
        }

        const conditionStillActive = relatedModStillActive(updatedTrackModification, activateConditionSet);

        return {
          ...condition,
          isAffecting: conditionStillActive,
          trackModifications: updatedTrackModification,
        };
      }),
    },
  };
}

function onAddingAdvantageEvent(
  character: Character,
  target: CharacterAttacks[] | CharacterSkills,
  event: Extract<EventCounterProp, { type: "addAdvantageEvent" }>,
): EventReturn<CharacterAttacks[] | CharacterSkills> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The Active event ref for adding advantage must be a Counter`,
      counterRef,
    );
    return { result: target };
  }

  const isActive = counterRef.eventsStatus === "active";

  const thisModification: TrackModifications = {
    name: counterRef.name,
    type: event.type,
    source: counterRef.source,
    id: counterRef.id,
  };

  if (event.scope === "skills") {
    const featureSet = new Set(event.features);
    const skill = target as CharacterSkills;

    return {
      result: {
        ...skill,
        skillsList: skill.skillsList.map((feature) => {
          if (!featureSet.has(feature.name)) {
            return feature;
          }

          if (!isActive) {
            const updatedTrackModification = feature.trackModifications.filter(
              (mod) => mod.id !== counterRef.id,
            );

            const stillAdvantage = relatedModStillActive(
              updatedTrackModification,
              addAdvantageSet,
            );

            return stillAdvantage
              ? { ...feature, trackModifications: updatedTrackModification }
              : {
                  ...feature,
                  hasAdvantage: false,
                  trackModifications: updatedTrackModification,
                };
          }

          if (
            feature.trackModifications.some((mod) => mod.id === counterRef.id)
          ) {
            return feature;
          }

          return {
            ...feature,
            hasAdvantage: true,
            trackModifications: [
              ...feature.trackModifications,
              thisModification,
            ],
          };
        }),
      },
    };
  }

  const featureSet = new Set(event.features);
  const attacks = target as CharacterAttacks[];

  return {
    result: attacks.map((feature) => {
      if (!featureSet.has(feature.abilityUsed)) {
        return feature;
      }

      if (!isActive) {
        const updatedTrackModification = feature.trackModifications.filter(
          (mod) => mod.id !== counterRef.id,
        );

        const stillAdvantage = relatedModStillActive(
          updatedTrackModification,
          addAdvantageSet,
        );

        return stillAdvantage
          ? { ...feature, trackModifications: updatedTrackModification }
          : {
              ...feature,
              hasAdvantage: false,
              trackModifications: updatedTrackModification,
            };
      }

      if (feature.trackModifications.some((mod) => mod.id === counterRef.id)) {
        return feature;
      }

      return {
        ...feature,
        hasAdvantage: true,
        trackModifications: [...feature.trackModifications, thisModification],
      };
    }),
  };
}

function onAddingReminderEvent(
  character: Character,
  target: CharacterReminder[],
  event: Extract<EventCounterProp, { type: "addReminderEvent" }>,
): EventReturn<CharacterReminder[]> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The Counter Ref to add a reminder must be a Continuous Event`,
      counterRef,
    );
    return { result: target };
  }

  const isActive = counterRef.eventsStatus === "active";

  if (!isActive) {
    return { result: target.filter((remind) => remind.id !== counterRef.id) };
  }

  const alreadyAdded = target.some((reminder) => reminder.id === counterRef.id);

  return {
    result: alreadyAdded
      ? target
      : [
          ...target,
          { name: counterRef.name, id: counterRef.id, content: event.content },
        ],
  };
}

function onAddingFetchedScoreEvent(
  character: Character,
  target: HasScoresWithTracking,
  event: Extract<EventCounterProp, { type: "addFetchedScoreEvent" }>,
): EventReturn<HasScoresWithTracking> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(`counterRef has to be a Continuous Counter`, counterRef);
    return { result: target };
  }

  const isActive = counterRef.eventsStatus === "active";

  if (!isActive) {
    const thisModification = target.trackModifications.find(
      (mod) => mod.id === counterRef.id,
    );

    if (!thisModification) {
      return { result: target };
    }

    if (!hasValueProperty(thisModification)) {
      devConsoleWarn(
        `When removing couldn't find the correspondin id or the fetched modification didn't have the value property`,
        thisModification,
      );
      return { result: target };
    }

    const updatedTrackModification = target.trackModifications.filter(
      (mod) => mod.id !== counterRef.id,
    );

    return {
      result: {
        ...target,
        currentScore: target.currentScore - thisModification.value,
        trackModifications: updatedTrackModification,
      },
    };
  }

  if (modificationIsApplied(target.trackModifications, counterRef.id)) {
    return { result: target };
  }

  const fetchedFeature = getTarget(character, event.fetchedFeature);

  if (!hasScoresWithTrackingProperty(fetchedFeature)) {
    devConsoleWarn(`The fetched feature has no score property`, fetchedFeature);
    return { result: target };
  }

  const valueToAdd = event.modifyValue
    ? calculateModifyValue(fetchedFeature.currentScore, event.modifyValue)
    : fetchedFeature.currentScore;

  const thisModification: Extract<
    TrackModifications,
    { type: "addFetchedScoreEvent" }
  > = {
    name: counterRef.name,
    type: event.type,
    id: counterRef.id,
    source: counterRef.source,
    value: valueToAdd,
  };

  return {
    result: {
      ...target,
      currentScore: target.currentScore + valueToAdd,
      trackModifications: [...target.trackModifications, thisModification],
    },
  };
}

function onAddingDiceToAttackBasedOnAbilityEvent(
  character: Character,
  target: CharacterAttacks[],
  event: Extract<
    EventCounterProp,
    { type: "addDiceToAttackBasedOnAbilityEvent" }
  >,
): EventReturn<CharacterAttacks[]> {
  const counterRef = getTarget(character, event.activeCounterRef);

  if (!isContinuousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(`counterRef has to ba a Continuous Event`, counterRef);
    return { result: target };
  }

  const toWhichAbilitySet = new Set(event.ability);

  const isActive = counterRef.eventsStatus === "active";

  const diceToAdd = (isTargetInterface(event.diceToAdd))
    ? getTarget(character, event.diceToAdd)
    : event.diceToAdd;

  if(!isDiceInterface(diceToAdd)) {
    devConsoleWarn(`fetched dice value should be a DiceInterface`, diceToAdd)
    return {result: target}
  }

  return {
    result: target.map((attack) => {
      if (!toWhichAbilitySet.has(attack.abilityUsed)) {
        return attack;
      }

      const blockByLimitation =
        event.limitations &&
        isBlockedByInternalFeatureLimitation(attack, event.limitations);

      if (!isActive || blockByLimitation) {
        const thisModification = attack.trackModifications.find(
          (mod) =>
            mod.id === counterRef.id &&
            hasDiceProperty(mod) &&
            isSameDice(mod.dice, diceToAdd),
        );

        if (!thisModification) {
          return attack;
        }

        if (!hasDiceProperty(thisModification)) {
          devConsoleWarn(
            `The modification fetched should have dice property`,
            thisModification,
          );
          return attack;
        }

        const updatedTrackModification = attack.trackModifications.filter(
          (mod) => {
            if (mod.id !== counterRef.id) {
              return true;
            }

            if (!hasDiceProperty(mod)) {
              return true;
            }

            return !isSameDice(mod.dice, diceToAdd);
          },
        );

        const diceIndex = attack.damageDice.findIndex((dice) =>
          isSameDice(dice, thisModification.dice),
        );

        if (diceIndex === -1) {
          devConsoleWarn(
            `Couldn't find the relative dice in the damage dices`,
            attack.damageDice,
          );
          return { ...attack, trackModifications: updatedTrackModification };
        }

        return {
          ...attack,
          damageDice: removeFromArrayByIndex(attack.damageDice, diceIndex),
          trackModifications: updatedTrackModification,
        };
      }

      // checks if the modification is stored in the trackModifications in
      // a more specific way because there is the possibility that
      // a counter may add more different dices all together.

      if (
        attack.trackModifications.some(
          (mod) =>
            mod.id === counterRef.id &&
            hasDiceProperty(mod) &&
            isSameDice(mod.dice, diceToAdd),
        )
      ) {
        return attack;
      }

      const thisModification: Extract<
        TrackModifications,
        { type: "addDiceToAttackBasedOnAbilityEvent" }
      > = {
        name: counterRef.name,
        type: event.type,
        source: counterRef.source,
        id: counterRef.id,
        dice: diceToAdd,
      };

      return {
        ...attack,
        damageDice: [...attack.damageDice, diceToAdd],
        trackModifications: [...attack.trackModifications, thisModification],
      };
    }),
  };
}

export const eventTypeResolver: EventTypeResolver = {
  replenishCounter: onReplenishEvent,
  replenishToValueCounter: onReplenishToValueEvent,
  heals: onHealEvent,
  trackerHeals: onTrackerHealEvent,
  cureOneCondition: onCuringOneCondition,
  useResource: onUseResource,
  addResistanceEvent: onAddingResistances,
  activateConditionEvent: onActivatingConditionEvent,
  addAdvantageEvent: onAddingAdvantageEvent,
  addReminderEvent: onAddingReminderEvent,
  addFetchedScoreEvent: onAddingFetchedScoreEvent,
  addDiceToAttackBasedOnAbilityEvent: onAddingDiceToAttackBasedOnAbilityEvent,
};
