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
  const data = new Map<
    string,
    {
      value: null | string | number | Date;
      formula: string;
      dependents: Set<string>;
    }
  >();

  const generateValues = async (doc: SheetPage[]) => {
    data.clear();
    doc.forEach((sheet) =>
      sheet.cells.forEach((row) =>
        row.forEach((cell) => {
          if (cell.formula) {
            if (!data.has(cell.key)) {
              data.set(cell.key, {
                value: "",
                formula: cell.formula,
                dependents: new Set(),
              });
            }

            cell.formula.match(/'[A-Za-z\d]+'![A-Z]+\d+/g)?.forEach((key) => {
              const item = data.get(key);
              if (item) {
                //TODO: fix this
                data.set(key, {value: item.value, formula: item.formula, item.dependents})
                item.dependents;
              }
            });
            // TODO: find the keys of the cells that the formula needs so they can be added as depencencies
            // Perhaps investigate source code on simple js excel page to see how formulas are evaluated
            // Don't re-invent the wheel. There has to be code for evaluating excel equations that you can find
          }
        })
      )
    );
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
            return <Input type="text" />;
          case "number":
            return cell.attributes.content.formatAsCurrency ? (
              <InputNumber<number>
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
              />
            ) : (
              <Input
                type="number"
                min={cell.attributes.content.min}
                max={cell.attributes.content.max}
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
              />
            );
          default:
            return;
        }
      }
    } else if (cell.value[0] === "=") {
      return <></>;
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
