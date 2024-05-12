/* global Excel */
/* global console */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import InputHandler from "./input/InputHandler";
import MessageHandler from "./messages/MessageHandler";
import PdfHandler from "./pdf/PdfHandler";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = () => {
  const styles = useStyles();
  const [selectedRange, setSelectedRange] = useState<Excel.Range>();

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
    return Excel.run(function (context) {
      // Get the newly selected range
      var newSelectedRange = context.workbook.getSelectedRange();
      newSelectedRange.load("address");

      // Execute the batch operation
      return context.sync().then(function () {
        // Update component state with the new selection
        setSelectedRange(newSelectedRange);
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
          <InputHandler title="Manage Input" range={selectedRange} />
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
