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

  // const insertText = async () => {
  //   try {
  //     Excel.run(async (context) => {
  //       const sheet = context.workbook.worksheets.getActiveWorksheet();
  //       const range = context.workbook.getSelectedRange();
  //       range.load("address");
  //       return context
  //         .sync()
  //         .then(function () {
  //           sheet.comments.add(range.address, "new comment");
  //         })
  //         .then(context.sync)
  //         .then(function () {
  //           console.log("success");
  //         });
  //     });
  //   } catch (error) {
  //     console.log("Error: " + error);
  //   }
  // };

  // const insertImage = async () => {
  //   try {
  //     Excel.run(async function (context) {
  //       // const sheet = context.workbook.worksheets.getActiveWorksheet();
  //       const cellRange = context.workbook.getSelectedRange(); // Specify the cell where you want to place the image

  //       cellRange.load("left,top,width,height");
  //       await context.sync();

  //       let shapes = context.workbook.worksheets.getActiveWorksheet().shapes;

  //       const imageSrc =
  //         "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";
  //       let image = shapes.addImage(imageSrc);
  //       image.name = "name";
  //       image.altTextDescription = "alt text description";
  //       image.altTextTitle = "alt text title";

  //       image.top = 500;
  //       image.left = cellRange.left;
  //       image.top = cellRange.top;
  //       image.width = cellRange.width;
  //       image.height = cellRange.height;

  //       return context.sync();
  //     });
  //   } catch (error) {
  //     console.log("Error: " + error);
  //   }
  // };

  return (
    <div className={styles.root}>
      <h1>Header</h1>
      <p>{selectedRange}</p>
      <Tabs>
        <TabList>
          <Tab>Manage Input</Tab>
          <Tab>Error Messages</Tab>
          <Tab>Map PDF</Tab>
        </TabList>
        <TabPanel>
          <InputHandler title="Manage Input" />
          {/* <p>Testing</p> */}
        </TabPanel>
        <TabPanel>
          <MessageHandler title="Error Messages" />
          {/* <p>Other</p> */}
        </TabPanel>
        <TabPanel>
          <PdfHandler title="Map PDF" />
          {/* <p>otherher</p> */}
        </TabPanel>
      </Tabs>
      {/* <button
        onClick={() => {
          insertText();
        }}
      >
        Set Text
      </button>
      <button
        onClick={() => {
          insertImage();
        }}
      >
        Insert Image
      </button> */}
    </div>
  );
};

export default App;
