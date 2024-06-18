/* global Excel */
/* global console */

import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import CellHandler from "./magic-cell/CellHandler";
import MessageHandler from "./messages/MessageHandler";
import PdfHandler from "./pdf/PdfHandler";
import Layout, { Content } from "antd/es/layout/layout";
import { Tabs, TabsProps } from "antd";
import { LIVE_SERVER } from "./export/ExportHandler";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

export interface CellRange {
  worksheet: string;
  address: string;
  text: string;
  cellCount: number;
  commentData?: string;
}

const App = () => {
  const styles = useStyles();
  const [selectedRange, setSelectedRange] = useState<CellRange>();

  const views: TabsProps["items"] = [
    {
      key: "0",
      label: "Custom Cell",
      children: (
        <div style={{ padding: "1rem" }}>
          <CellHandler range={selectedRange} />
        </div>
      ),
    },
    {
      key: "1",
      label: "Page Controls",
      children: (
        <div style={{ padding: "1rem" }}>
          <MessageHandler worksheet={selectedRange?.worksheet} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Map PDF",
      children: (
        <div style={{ padding: "1rem" }}>
          <PdfHandler />
        </div>
      ),
    },
  ];

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
      newSelectedRange.load("address,addressLocal,text,cellCount,worksheet/name");

      try {
        await context.sync();
      } catch {
        setSelectedRange(undefined);
        return;
      }

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
        worksheet: newSelectedRange.worksheet.name,
        address: newSelectedRange.address,
        text: newSelectedRange.text[0][0],
        cellCount: newSelectedRange.cellCount,
        commentData: commentContent,
      });

      LIVE_SERVER.handleChange();
    }).catch(function (error) {
      console.log("Error: " + error);
    });
  };

  return (
    <div className={styles.root}>
      <Layout>
        <Content>
          <Tabs defaultActiveKey="0" items={views} size="small" centered tabBarGutter={16} />
        </Content>
      </Layout>
    </div>
  );
};

export default App;
