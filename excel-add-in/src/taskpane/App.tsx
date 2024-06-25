/* global Excel */
/* global console */

import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import CellHandler from "./cell-handler/CellHandler";
import SheetHandler from "./sheet-handler/SheetHandler";
import PdfHandler from "./pdf-handler/PdfHandler";
import Layout, { Content } from "antd/es/layout/layout";
import { Progress, Tabs, TabsProps } from "antd";
import { ExportHandler } from "./export/ExportHandler";
import "./App.scss";

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
  const [exportProgress, setExportProgress] = useState<number>(0.0);

  const LIVE_SERVER = new ExportHandler(setExportProgress);

  const views: TabsProps["items"] = [
    {
      key: "0",
      label: "Manage Cell",
      children: (
        <div className="tab">
          <CellHandler range={selectedRange} LIVE_SERVER={LIVE_SERVER} />
        </div>
      ),
    },
    {
      key: "1",
      label: "Manage Worksheet",
      children: (
        <div className="tab">
          <SheetHandler worksheet={selectedRange?.worksheet} LIVE_SERVER={LIVE_SERVER} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Upload PDF",
      children: (
        <div className="tab">
          <PdfHandler LIVE_SERVER={LIVE_SERVER} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleSelectionChanged(null);

    Excel.run(function (context) {
      context.workbook.onSelectionChanged.add(handleSelectionChanged);
      context.workbook.worksheets.onChanged.add(handleChange);
      context.workbook.worksheets.onMoved.add(handleChange);
      context.workbook.worksheets.onNameChanged.add(handleChange);
      context.workbook.worksheets.onDeleted.add(handleChange);
      return context.sync();
    });

    return () => {
      Excel.run(function (context) {
        context.workbook.onSelectionChanged.remove(handleSelectionChanged);
        context.workbook.worksheets.onChanged.remove(handleChange);
        context.workbook.worksheets.onMoved.remove(handleChange);
        context.workbook.worksheets.onNameChanged.remove(handleChange);
        context.workbook.worksheets.onDeleted.remove(handleChange);
        return context.sync();
      });
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = async (_: any): Promise<void> => {
    LIVE_SERVER.handleChange();
    setTimeout(() => {
      if (exportProgress === 0) LIVE_SERVER.handleChange();
    }, 3000);
  };

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
    }).catch(function (error) {
      console.log("Error: " + error);
    });
  };

  return (
    <div className={styles.root + " App"}>
      <div className={"loading-bar" + (exportProgress === 0 ? " reset" : "")}>
        <Progress percent={exportProgress * 100} size="small" strokeLinecap="butt" showInfo={false} />
      </div>
      <Layout>
        <Content>
          <Tabs defaultActiveKey="0" items={views} size="small" centered tabBarGutter={16} />
        </Content>
      </Layout>
    </div>
  );
};

export default App;
