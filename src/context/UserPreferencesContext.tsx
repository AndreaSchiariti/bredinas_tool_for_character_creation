import { createContext, useContext, useEffect, useState } from "react";
import type { Units } from "../types/character_utils";
import type { ChildrenInterface } from "../types/react-types";

interface UserPreferences {
  preferredUnit: Units;
  skillsWithAbilities: boolean;
}

interface ContextUserPreferences {
  preferredUnit: Units;
  onChangePreferredUnit: (selectedUnit: Units) => void;
  userPreferences: UserPreferences;
  skillsWithAbilities: boolean;
  onChangeSkillsWithAbilities: () => void;
}

type PreferenceKey = "preferredUnit" | "skillsWithAbilities";

type PreferenceNewValue = Units | boolean;

export const UserPreferences = createContext<
  ContextUserPreferences | undefined
>(undefined);

export function getUserPreferences(): UserPreferences {
  const stored = localStorage.getItem("userPreferences");

  const storedPreferences: UserPreferences | null = stored
    ? (JSON.parse(stored) as UserPreferences)
    : null;

  if (!storedPreferences) {
    return { preferredUnit: "feet", skillsWithAbilities: true };
  }

  return storedPreferences;
}

function updateUserPreferences(
  key: PreferenceKey,
  newValue: PreferenceNewValue,
  preferenceObj: UserPreferences
): UserPreferences {
  return { ...preferenceObj, [key]: newValue };
}

export function UserPreferencesContext(): ContextUserPreferences {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(
    getUserPreferences()
  );

  useEffect((): void => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  function onChangePreferredUnit(selectedUnit: Units): void {
    setUserPreferences(
      updateUserPreferences("preferredUnit", selectedUnit, userPreferences)
    );
  }

  function onChangeSkillsWithAbilities(): void {
    setUserPreferences(
      updateUserPreferences(
        "skillsWithAbilities",
        !userPreferences.skillsWithAbilities,
        userPreferences
      )
    );
  }

  return {
    preferredUnit: userPreferences.preferredUnit,
    onChangePreferredUnit,
    userPreferences,
    onChangeSkillsWithAbilities,
    skillsWithAbilities: userPreferences.skillsWithAbilities,
  };
}

export function UserPreferencesProvider({ children }: ChildrenInterface) {
  const userPreferences = UserPreferencesContext();

  return (
    <UserPreferences.Provider value={userPreferences}>
      {children}
    </UserPreferences.Provider>
  );
}

export function useUserPreferencesContext(): ContextUserPreferences {
  const userPreferencesContext = useContext(UserPreferences);

  if (!userPreferencesContext) {
    throw new Error(
      "useUserPreferencesContext must be used inside UserPreferencesProvider"
    );
  }

  return userPreferencesContext;
}
