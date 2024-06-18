import "./App.scss";
import DataEntryMonolith from "./data-entry-monolith/DataEntryMonolith";

export type CellData = {
  value: string;
  formula?: string;
  dependents: Set<string>;
};

function App() {
  return (
    <div className="App">
      <DataEntryMonolith />
    </div>
  );
}

export default App;
