import { Test } from "./components/Test";
import { CharacterContex } from "./context/CharacterContext"

//mock character
import character from "./utils/mock-json/character_json.json"

function App() {

  return (
    <>
      {!character && <h1>No Character provided</h1>}
      {character && (
        <CharacterContex.Provider value={character}>
         <Test />
        </CharacterContex.Provider>
      )}
    </>
  );
}

export default App
