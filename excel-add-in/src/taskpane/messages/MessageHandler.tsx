/* global console */
/* global Excel */

import { Input } from "antd";
import React, { FC, useEffect, useState } from "react";
import { LIVE_SERVER } from "../export/ExportHandler";

interface MessageHandlerProps {
  worksheet?: string;
}

export const SHEET_PROPERTIES = "PropertiesContainer";
export interface SheetProperties {
  tabName: string;
}

const MessageHandler: FC<MessageHandlerProps> = ({ worksheet }: MessageHandlerProps) => {
  const [sheetProperties, setSheetProperties] = useState<SheetProperties | null>(null);

  useEffect(() => {
    try {
      Excel.run(async (context) => {
        const shapes = context.workbook.worksheets.getActiveWorksheet().shapes;
        let propsContainer: Excel.Shape;
        console.log("trying to get item");
        propsContainer = shapes.getItemOrNullObject(SHEET_PROPERTIES);
        propsContainer.load("name");

        await context.sync();

        if (!propsContainer.name) {
          propsContainer = shapes.addGeometricShape(Excel.GeometricShapeType.rectangle);
          propsContainer.name = SHEET_PROPERTIES;
          propsContainer.width = 2;
          propsContainer.height = 2;

          await context.sync();
        }

        propsContainer.altTextDescription = JSON.stringify(sheetProperties);

        await context.sync();
        LIVE_SERVER.handleChange();
      });
    } catch (error) {
      console.log("Save Page Props Error:", error);
    }
  }, [sheetProperties]);

  useEffect(() => {
    try {
      Excel.run(async (context) => {
        const shapes = context.workbook.worksheets.getActiveWorksheet().shapes;
        let propsContainer: Excel.Shape;

        try {
          propsContainer = shapes.getItem(SHEET_PROPERTIES);
          propsContainer.load("altTextDescription");
          await context.sync();
          setSheetProperties(JSON.parse(propsContainer.altTextDescription));
        } catch {
          console.log("failed");
          setSheetProperties(null);
        }

        return context.sync();
      });
    } catch (error) {
      console.log("Load Page Props Error:", error);
    }
  }, [worksheet]);

  return (
    <div>
      {worksheet ? (
        <>
          <h1>Managing {worksheet}</h1>

          <label>
            Tab Name
            <Input
              value={sheetProperties?.tabName}
              placeholder={worksheet}
              onChange={(e) => setSheetProperties({ ...sheetProperties, tabName: e.target.value })}
            />
          </label>
        </>
      ) : (
        <div>Select a cell to manage page properties.</div>
      )}
    </div>
  );
};

export default MessageHandler;
