import { CharacterSheet } from "./components/CharacterSheet";
import { LanguageToggleButton } from "./components/temp/LanguageToggleButton";
import { ThemeToggleButton } from "./components/temp/ThemeToggleButton";
import { UnitChangingButton } from "./components/temp/UnitChangingButton";
import { CharacterContex } from "./context/CharacterContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";

//mock character
import characterJson from "./mock-json/mockCharacter.json";
import type { Character } from "./types/character.types";
import type { Units } from "./types/characterUtils.type";

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
