/* global Excel */
/* global console */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CellHandler from "./magic-cell/CellHandler";
import MessageHandler from "./messages/MessageHandler";
import PdfHandler from "./pdf/PdfHandler";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});
export interface CellRange {
  address: string;
  text: string;
  cellCount: number;
}

const App = () => {
  const styles = useStyles();
  const [selectedRange, setSelectedRange] = useState<CellRange>();

  useEffect(() => {
    // Setup event listener for selection change
    Excel.run(function (context) {
      context.workbook.onSelectionChanged.add(handleSelectionChanged);
      return context.sync();
    });

    // Cleanup event listener on component unmount
    return () => {
      // eslint-disable-next-line no-undef
      Excel.run(function (context) {
        context.workbook.onSelectionChanged.remove(handleSelectionChanged);
        return context.sync();
      });
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectionChanged = (_: Excel.SelectionChangedEventArgs): Promise<void> => {
    return Excel.run(async (context) => {
      // Get the newly selected range
      var newSelectedRange = context.workbook.getSelectedRange();
      newSelectedRange.load("address,addressLocal,text,cellCount");

      // Execute the batch operation
      await context.sync();
      // Update component state with the new selection
      setSelectedRange({
        address: newSelectedRange.address,
        text: newSelectedRange.text[0][0],
        cellCount: newSelectedRange.cellCount,
      });
    }).catch(function (error) {
      // eslint-disable-next-line no-undef
      console.log("Error: " + error);
    });
  };

  return (
    <div className={styles.root}>
      <h1>Header</h1>
      <Tabs>
        <TabList>
          <Tab>Manage Input</Tab>
          <Tab>Error Messages</Tab>
          <Tab>Map PDF</Tab>
        </TabList>
        <TabPanel>
          <CellHandler title="Manage Input" range={selectedRange} />
        </TabPanel>
        <TabPanel>
          <MessageHandler title="Error Messages" />
        </TabPanel>
        <TabPanel>
          <PdfHandler title="Map PDF" />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default App;
