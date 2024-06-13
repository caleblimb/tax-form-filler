/* global console */
/* global Excel */

import { Input } from "antd";
import React, { FC, useEffect, useState } from "react";

interface MessageHandlerProps {
  worksheet?: string;
}

interface SheetProperties {
  name?: string;
}

const MessageHandler: FC<MessageHandlerProps> = ({ worksheet }: MessageHandlerProps) => {
  const [sheetProperties, setSheetProperties] = useState<SheetProperties | null>(null);
  const propertiesContainerName = "PropertiesContainer";

  useEffect(() => {
    try {
      Excel.run(async (context) => {
        const shapes = context.workbook.worksheets.getActiveWorksheet().shapes;
        let propsContainer: Excel.Shape;
        console.log("trying to get item");
        propsContainer = shapes.getItemOrNullObject(propertiesContainerName);
        propsContainer.load("name");

        await context.sync();

        if (!propsContainer.name) {
          propsContainer = shapes.addGeometricShape(Excel.GeometricShapeType.rectangle);
          propsContainer.name = propertiesContainerName;
          propsContainer.width = 2;
          propsContainer.height = 2;

          await context.sync();
        }

        propsContainer.altTextDescription = JSON.stringify(sheetProperties);

        return context.sync();
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
          propsContainer = shapes.getItem(propertiesContainerName);
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
              value={sheetProperties?.name}
              placeholder={worksheet}
              onChange={(e) => setSheetProperties({ ...sheetProperties, name: e.target.value })}
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
