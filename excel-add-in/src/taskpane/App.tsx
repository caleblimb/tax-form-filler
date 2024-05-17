/* global Excel */
/* global console */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import CellHandler from "./magic-cell/CellHandler";
import MessageHandler from "./messages/MessageHandler";
import PdfHandler from "./pdf/PdfHandler";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { Menu } from "antd";
import ExportHandler from "./export/ExportHandler";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

export interface CellRange {
  address: string;
  text: string;
  cellCount: number;
  commentData?: string;
}

const App = () => {
  const styles = useStyles();
  const [selectedRange, setSelectedRange] = useState<CellRange>();
  const defaultNavIndex = "cell";
  const [navIndex, setNavIndex] = useState<string>(defaultNavIndex);

  useEffect(() => {
    handleSelectionChanged(null);

    Excel.run(function (context) {
      context.workbook.onSelectionChanged.add(handleSelectionChanged);
      return context.sync();
    });

    return () => {
      Excel.run(function (context) {
        context.workbook.onSelectionChanged.remove(handleSelectionChanged);
        return context.sync();
      });
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectionChanged = async (_: Excel.SelectionChangedEventArgs | null): Promise<void> => {
    return Excel.run(async (context) => {
      const newSelectedRange = context.workbook.getSelectedRange();
      newSelectedRange.load("address,addressLocal,text,cellCount");

      await context.sync();

      let commentContent;
      try {
        const comment = context.workbook.comments.getItemByCell(newSelectedRange.address);
        comment.load("content");
        await context.sync();
        commentContent = comment?.content;
      } catch {
        //
      }

      setSelectedRange({
        address: newSelectedRange.address,
        text: newSelectedRange.text[0][0],
        cellCount: newSelectedRange.cellCount,
        commentData: commentContent,
      });
    }).catch(function (error) {
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
              { key: "export", label: "Export" },
            ]}
            style={{ flex: 1, minWidth: 0, width: "100%" }}
            onClick={(e) => {
              setNavIndex(e.key);
            }}
          />
        </Header>

        <Content style={{ padding: "1rem" }}>
          <div>
            {navIndex === "cell" && <CellHandler range={selectedRange} />}
            {navIndex === "page" && <MessageHandler title="Error Messages" />}
            {navIndex === "pdf" && <PdfHandler />}
            {navIndex === "export" && <ExportHandler />}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
