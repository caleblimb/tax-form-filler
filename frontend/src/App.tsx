import "./App.scss";
import DataEntryMonolith from "./data-entry-monolith/DataEntryMonolith";

export type CellData = {
  value: string;
  formula?: string;
  dependents: Set<string>;
};

function App() {
  return (
    <>
      <header className="App">
        <h1>More like Turbo Quacks</h1>
      </header>

      <main className="App">
        <DataEntryMonolith />
      </main>

      <footer className="App"></footer>
    </>
  );
}

export default App;
