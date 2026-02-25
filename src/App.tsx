import { CharacterSheet } from "./frontend/components/CharacterSheet";
import { LanguageToggleButton } from "./frontend/components/temp/LanguageToggleButton";
import { ThemeToggleButton } from "./frontend/components/temp/ThemeToggleButton";
import { UnitChangingButton } from "./frontend/components/temp/UnitChangingButton";
import { CharacterContex } from "./context/CharacterContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";

//mock character
import characterJson from "./mock-json/mockCharacter.json";
import type { Character } from "./backend/types/character.types/character.types";
import type { Units } from "./backend/types/character.types/characterUtils.type";

const character: Character = characterJson as Character;

// mock array for units button
const units: Units[] = ["feet", "meters", "squares"];

function App() {
  return (
    <UserPreferencesProvider>
      <div className="">
        <div className="temp-buttons-container">
          {units.map((unit) => (
            <UnitChangingButton key={unit} unit={unit} />
          ))}
          <LanguageToggleButton />
          <ThemeToggleButton />
        </div>
        {!character && <h1>No Character provided</h1>}
        {character && (
          <CharacterContex.Provider value={character}>
            <CharacterSheet />
          </CharacterContex.Provider>
        )}
      </div>
    </UserPreferencesProvider>
  );
}

export default App;
