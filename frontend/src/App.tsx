import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { getDoc } from "./api/ServerData";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

function App() {
  const [doc, setDoc] = useState<any[]>();

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

  return (
    <div className="App">
      <Tabs>
        <TabList>
          {doc?.map((sheet) => (
            <Tab key={"tab-" + sheet.Name}>{sheet.Name}</Tab>
          ))}
        </TabList>
        {doc?.map((sheet) => (
          <TabPanel key={"panel-" + sheet.Name}>
            <table>
              <tbody>
                {sheet.Cells.map((row: any, rowIndex: number) => (
                  <tr key={"panel-" + sheet.Name + ":" + rowIndex}>
                    {row.map((cell: any, colIndex: number) => (
                      <td
                        key={
                          "panel-" +
                          sheet.Name +
                          ":" +
                          rowIndex +
                          ":" +
                          colIndex
                        }
                      >
                        {cell.Value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

export default App;
