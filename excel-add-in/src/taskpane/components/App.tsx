/* global Excel */
/* global console */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = () => {
  const styles = useStyles();
  const [selectedRange, setSelectedRange] = useState<string>("");

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
        setSelectedRange(newSelectedRange.address);
      });
    }).catch(function (error) {
      // eslint-disable-next-line no-undef
      console.log("Error: " + error);
    });
  };

  const insertText = async () => {
    // Write text to the top left cell.
    try {
      Excel.run(async (context) => {
        // const sheet = context.workbook.worksheets.getActiveWorksheet();
        // const range = sheet.getRange("A1");
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = context.workbook.getSelectedRange();
        range.load("address");
        // range.format.autofitColumns();
        return context
          .sync()
          .then(function () {
            sheet.comments.add(range.address, "new comment");
          })
          .then(context.sync)
          .then(function () {
            console.log("success");
          });
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div className={styles.root}>
      <h1>Header</h1>
      <p>{selectedRange}</p>
      <button
        onClick={() => {
          insertText();
        }}
      >
        Set Text
      </button>
    </div>
  );
};

export default App;
