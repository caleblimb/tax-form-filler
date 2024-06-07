import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { getDoc } from "./api/ServerData";
import { SheetPage } from "../../shared/SheetPage";
import { Cell } from "../../shared/Cell";
import DataPage from "./components/DataPage";

export type CellData = {
  value: string;
  formula?: string;
  dependents: Set<string>;
};

function App() {
  const [doc, setDoc] = useState<SheetPage[]>();

  const [dataState, setDataState] = useState<Map<string, CellData>>();

  console.log("hello");
  const data = useRef<Map<string, CellData>>(new Map());

  const updateCell = (key: string, newValue?: string) => {
    const cell = data.current.get(key);
    if (cell) {
      if (newValue) {
        data.current.set(key, {
          value: newValue,
          formula: cell.formula,
          dependents: cell.dependents,
        });
      } else if (cell.formula) {
        const referenceFreeFormula = cell.formula.replace(
          /'[A-Za-z\d]+'![A-Z]+\d+/g,
          (match) => {
            return data.current.get(match)!.value;
          }
        );
        data.current.set(key, {
          value: referenceFreeFormula, //TODO: parse
          formula: cell.formula,
          dependents: cell.dependents,
        });
      } else {
        data.current.set(key, {
          value: "",
          formula: cell.formula,
          dependents: cell.dependents,
        });
      }
      cell.dependents.forEach((dependent) => {
        updateCell(dependent);
      });
    }
  };

  const handleChange = (key: string, newValue?: string) => {
    updateCell(key, newValue);
    console.log("data:", data);
    setDataState(new Map(data.current));
  };

  useEffect(() => {
    console.log("dataState:", dataState);
    console.log("CellState:", dataState?.get("'U2NoZWR1bGUgQw'!E33")?.value);
  }, [dataState]);

  const generateValues = async (doc: SheetPage[]) => {
    data.current.clear();
    doc.forEach((sheet) =>
      sheet.cells.forEach((row: Cell[]) =>
        row.forEach((cell: Cell) => {
          if (cell.formula) {
            const item = data.current.get(cell.key);
            if (item) {
              data.current.set(cell.key, {
                value: item.value,
                formula: cell.formula,
                dependents: item.dependents,
              });
            } else {
              data.current.set(cell.key, {
                value: cell.value, // This is probably a formula
                formula: cell.formula,
                dependents: new Set<string>(),
              });
            }

            cell.formula.match(/'[A-Za-z\d]+'![A-Z]+\d+/g)?.forEach((key) => {
              const dependency = data.current.get(key);
              if (dependency) {
                data.current.set(key, {
                  value: dependency.value,
                  formula: dependency.formula,
                  dependents: dependency.dependents.add(cell.key),
                });
              } else {
                let initialValue: string = "";
                if (cell.key === key) {
                  if (cell.attributes?.type === "input") {
                    //TODO: add switch statement for type of input
                  }
                }
                data.current.set(key, {
                  value: initialValue,
                  formula: undefined,
                  dependents: new Set<string>().add(cell.key),
                });
              }
            });
          }
        })
      )
    );
    setDataState(data.current);
    console.log(data.current);
  };

  useEffect(() => {
    getDoc()
      .then((response: any) => {
        setDoc(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (doc) {
      generateValues(doc);
    }
  }, [doc]);

  return (
    <div className="App">
      {/* <Tabs defaultActiveKey="0" items={tabs} /> */}
      {doc?.map((page, index) => (
        <DataPage
          key={"page:" + index}
          page={page}
          handleChange={(key, change) => handleChange(key, change)}
          dataState={dataState}
        />
      ))}
    </div>
  );
}

export default App;
