import React, { ReactNode, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { getDoc } from "./api/ServerData";
import { SheetPage } from "../../shared/SheetPage";
import {
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Tabs,
  TabsProps,
} from "antd";
import { Cell } from "../../shared/Cell";

function App() {
  const [doc, setDoc] = useState<SheetPage[]>();
  const [tabs, setTabs] = useState<TabsProps["items"]>();
  // TODO: See if data needs to be a state
  const data = new Map<
    string,
    {
      value: string;
      formula: null | string;
      dependents: Set<string>;
    }
  >();

  const updateCell = (key: string, newValue?: string) => {
    const cell = data.get(key);
    if (cell) {
      if (cell.formula) {
        cell.formula.replace(/'[A-Za-z\d]+'![A-Z]+\d+/g, (match) => {
          return data.get(match)!.value;
        });
        data.set(key, {
          value: newValue ?? "",
          formula: cell.formula,
          dependents: cell.dependents,
        });
        cell.dependents.forEach((dependent) => {
          updateCell(dependent);
        });
      }
    }
  };

  const generateValues = async (doc: SheetPage[]) => {
    data.clear();
    doc.forEach((sheet) =>
      sheet.cells.forEach((row: Cell[]) =>
        row.forEach((cell: Cell) => {
          if (cell.formula) {
            const item = data.get(cell.key);
            if (item) {
              data.set(cell.key, {
                value: "",
                formula: cell.formula,
                dependents: item.dependents,
              });
            } else {
              data.set(cell.key, {
                value: "",
                formula: cell.formula,
                dependents: new Set<string>(),
              });
            }

            cell.formula.match(/'[A-Za-z\d]+'![A-Z]+\d+/g)?.forEach((key) => {
              const dependency = data.get(key);
              if (dependency) {
                data.set(key, {
                  value: dependency.value,
                  formula: dependency.formula,
                  dependents: dependency.dependents.add(cell.key),
                });
              } else {
                data.set(key, {
                  value: "",
                  formula: null,
                  dependents: new Set<string>().add(cell.key),
                });
              }
            });
          }
        })
      )
    );
    console.log(data);
  };

  useEffect(() => {
    getDoc()
      .then((response: any) => {
        setDoc(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (doc) {
      generateValues(doc);
      const newTabs: TabsProps["items"] = doc.map((page, index) => {
        return {
          key: index.toString(),
          label: page.name,
          children: parsePage(page),
        };
      });
      setTabs(newTabs);
    }
  }, [doc]);

  const parsePage = (page: SheetPage): ReactNode => {
    return (
      <table>
        <tbody>
          {page.cells.map((row, rowIndex) => (
            <tr key={"row:" + rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cell.key + ":" + cellIndex}>{parseCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const parseCell = (cell: Cell): ReactNode => {
    if (cell.attributes) {
      if (cell.attributes.type === "input") {
        switch (cell.attributes.content?.type) {
          case "text":
            return (
              <Input
                type="text"
                onChange={(e) => updateCell(cell.key, e.target.value)}
              />
            );
          case "number":
            return cell.attributes.content.formatAsCurrency ? (
              <InputNumber<number>
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
                onChange={(e) => updateCell(cell.key, e?.toString())}
              />
            ) : (
              <Input
                type="number"
                min={cell.attributes.content.min}
                max={cell.attributes.content.max}
                onChange={(e) => updateCell(cell.key, e.target.value)}
              />
            );
          case "date":
            return <DatePicker />;
          case "dropdown":
            return (
              <Select
                style={{ minWidth: "10rem" }}
                allowClear
                options={cell.attributes.content.options?.map(
                  (option, index) => {
                    return { value: option + index, label: option };
                  }
                )}
                onChange={(e) => updateCell(cell.key, e.target.value)}
              />
            );
          case "radio":
            return (
              <Radio.Group
                options={cell.attributes.content.options?.map(
                  (option, index) => {
                    return { value: option + index, label: option };
                  }
                )}
                onChange={(e) => updateCell(cell.key, e.target.value)}
              />
            );
          default:
            return;
        }
      }
    } else if (cell.formula) {
      return <>{data.get(cell.key)?.value}</>;
    } else {
      return <>{cell.value}</>;
    }
    return <></>;
  };

  return (
    <div className="App">
      <Tabs defaultActiveKey="0" items={tabs} />
    </div>
  );
}

export default App;
