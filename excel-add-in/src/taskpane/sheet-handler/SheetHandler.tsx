/* global console */
/* global Excel */

import { Input } from "antd";
import React, { FC, useEffect, useState } from "react";
import { ExportHandler } from "../export/ExportHandler";
import { SHEET_PROPERTIES, SheetProperties } from "../types/SheetProperties";

interface MessageHandlerProps {
  worksheet?: string;
  LIVE_SERVER: ExportHandler;
}

const defaultSheetProperties: SheetProperties = { tabName: "", isPDF: false };

export const createSheetsPropsContainer = async (
  context: Excel.RequestContext,
  sheet: Excel.Worksheet,
  isPDF: boolean = false,
  fileName?: string
) => {
  const shapes = sheet.shapes;
  let propsContainer = shapes.getItemOrNullObject(SHEET_PROPERTIES);
  propsContainer.load("name");

  await context.sync();

  if (!propsContainer.name) {
    propsContainer = shapes.addGeometricShape(Excel.GeometricShapeType.rectangle);
    propsContainer.name = SHEET_PROPERTIES;
    propsContainer.width = 2;
    propsContainer.height = 2;

    await context.sync();

    propsContainer.altTextDescription = JSON.stringify({ ...defaultSheetProperties, isPDF, fileName });

    await context.sync();
  }
};

export const getSheetProperties = async (
  context: Excel.RequestContext,
  sheet: Excel.Worksheet
): Promise<SheetProperties> => {
  try {
    const shapes = sheet.shapes;
    const sheetPropertiesContainer: Excel.Shape = shapes.getItemOrNullObject(SHEET_PROPERTIES);
    sheetPropertiesContainer.load("altTextDescription");
    sheet.load("name");
    await context.sync();
    if (sheetPropertiesContainer !== undefined) {
      const parsedSheetProperties: SheetProperties = JSON.parse(sheetPropertiesContainer.altTextDescription);
      if (parsedSheetProperties) {
        return {
          ...parsedSheetProperties,
          tabName: parsedSheetProperties.tabName.length > 0 ? parsedSheetProperties.tabName : sheet.name,
        };
      }
    }
  } catch {
    console.error("Could not fetch Sheet Properties for:", sheet.name);
  }

  createSheetsPropsContainer(context, sheet);
  return defaultSheetProperties;
};

const SheetHandler: FC<MessageHandlerProps> = ({ worksheet, LIVE_SERVER }: MessageHandlerProps) => {
  const [sheetProperties, setSheetProperties] = useState<SheetProperties>(defaultSheetProperties);

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
        const props = await getSheetProperties(context, context.workbook.worksheets.getActiveWorksheet());
        setSheetProperties(props);
      });
    } catch (error) {
      console.log("Load Page Props Error:", error);
    }
  }, [worksheet]);

  return (
    <div>
      {worksheet ? (
        <>
          <h1>Manage {worksheet}</h1>
          <p>
            Type:&nbsp;
            {sheetProperties.isPDF ? <>PDF Export Map</> : <>Data Entry Page</>}
          </p>

          {sheetProperties.fileName !== undefined && <p>File Name: {sheetProperties.fileName}</p>}

          <label>
            {sheetProperties.isPDF ? <>Card Name</> : <>Tab Name</>}
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

export default SheetHandler;
