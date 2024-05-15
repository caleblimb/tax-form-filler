/* global Excel */
/* global console */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import CellHandler from "./magic-cell/CellHandler";
import MessageHandler from "./messages/MessageHandler";
import PdfHandler from "./pdf/PdfHandler";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { Menu } from "antd";

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
  const defaultNavIndex = "cell";
  const [navIndex, setNavIndex] = useState<string>(defaultNavIndex);

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
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0",
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[defaultNavIndex]}
            items={[
              { key: "cell", label: "Custom Cell" },
              { key: "page", label: "Page Controls" },
              { key: "pdf", label: "Map PDF" },
            ]}
            style={{ flex: 1, minWidth: 0, width: "100%" }}
            onClick={(e) => {
              setNavIndex(e.key);
            }}
          />
        </Header>

        <Content style={{ padding: "1rem" }}>
          <div>
            {navIndex === "cell" && <CellHandler title="Manage Input" range={selectedRange} />}
            {navIndex === "page" && <MessageHandler title="Error Messages" />}
            {navIndex === "pdf" && <PdfHandler title="Map PDF" />}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
