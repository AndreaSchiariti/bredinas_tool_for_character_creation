import { CharacterSheet } from "./components/CharacterSheet";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { CharacterContex } from "./context/CharacterContext";

//mock character
import characterJson from "./mock-json/character_json.json";
import type { Character } from "./types/character";

const character: Character = characterJson as Character;

function App() {
  return (
    <div className="flex-v-center-between">
      <ThemeToggleButton />
      {!character && <h1>No Character provided</h1>}
      {character && (
        <CharacterContex.Provider value={character}>
          <CharacterSheet />
        </CharacterContex.Provider>
      )}
    </div>
  );
}

export default App;
