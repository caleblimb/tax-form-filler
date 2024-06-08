/* global Excel */
//* global setTimeout */
/* global console */

import { Button, message } from "antd";
import React, { FC } from "react";
import { SheetPage } from "../types/SheetPage";
import { PdfMap } from "../types/PdfMap";
import { Cell } from "../types/Cell";
import { encodeSheetName, nextExcelColumnCode, unfoldFormula } from "./ExportUtilities";
import { generateTypescript } from "./DataEntryMonolithBuilder";

const ExportHandler: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const exportDocument = async () => {
    try {
      Excel.run(async (context: Excel.RequestContext) => {
        const worksheets = context.workbook.worksheets;
        worksheets.load("items");

        await context.sync();

        const items = worksheets.items;
        let mappedSheets: SheetPage[] = [];
        let pdfSheets: PdfMap[] = [];

        const sheetNames = items.map((sheet) => sheet.name).sort((a, b) => b.length - a.length);

        for (let i = 0; i < items.length; i++) {
          const sheet = items[i];
          const range = sheet.getUsedRange();

          if (sheet.name.indexOf("!") > -1) {
            const errorMessage =
              "Invalid sheet name:" +
              sheet.name +
              "\n! is not allowed in Sheet Names as it can cause errors in formula parsing.";
            messageApi.open({ type: "error", content: errorMessage });
            throw new Error(errorMessage);
          }

          const bracketsRegex = /{.*}/;
          const isPdfSheet = bracketsRegex.test(sheet.name);

          if (isPdfSheet) {
            range.load("formulas");

            await context.sync();

            const connections = range.formulas.map((row) =>
              row[0][0] === "=" ? unfoldFormula(sheet.name, sheetNames, row[0]) : row[0]
            );
            const pdfSheet = {
              fileName: sheet.name.replace(/[{}]/g, ""),
              connections: connections,
            };
            pdfSheets.push(pdfSheet);
          } else {
            range.load("formulas,columnIndex,rowIndex,address");
            sheet.comments.load("items");

            await context.sync();

            const comments = sheet.comments.items;
            const xOffset: number = range.columnIndex;
            const yOffset: number = range.rowIndex;
            const rowAddress: number = +range.address.match(/![A-Z]+[1-9]+/g)![0].match(/[1-9]+/g)![0];
            const colAddress: string = range.address.match(/![A-Z]+[1-9]+/g)![0].match(/[A-Z]+/g)![0];

            let mappedComments: Map<string, string> = new Map<string, string>();

            for (let c = 0; c < comments.length; c++) {
              const location = comments[c].getLocation();
              location.load("columnIndex,rowIndex");

              await context.sync();

              const key: string = location.columnIndex + ":" + location.rowIndex;
              mappedComments.set(key, comments[c].content);
            }

            const mappedCells: Cell[][] = range.formulas.map((row: string[], y: number): Cell[] => {
              const cols: string[] = [colAddress];
              return row.map((value: string, x: number): Cell => {
                const xPosition = xOffset + x;
                const yPosition = yOffset + y;
                const positionKey = xPosition + ":" + yPosition;
                if (cols.length === x) {
                  cols.push(nextExcelColumnCode(cols[cols.length - 1]));
                }

                const attributes = mappedComments.get(positionKey);
                let mappedAttributes;
                try {
                  mappedAttributes = JSON.parse(attributes!);
                } catch {
                  mappedAttributes = undefined;
                }

                return {
                  key: "'" + encodeSheetName(sheet.name) + "'!" + cols[x] + (rowAddress + y),
                  value: value,
                  formula: value[0] === "=" ? unfoldFormula(sheet.name, sheetNames, value) : undefined,
                  attributes: mappedAttributes,
                  set: "set_" + encodeSheetName(sheet.name) + "_" + cols[x] + (rowAddress + y),
                  get: "get_" + encodeSheetName(sheet.name) + "_" + cols[x] + (rowAddress + y),
                };
              });
            });

            const mappedSheet: SheetPage = {
              name: sheet.name,
              cells: mappedCells,
            };

            mappedSheets.push(mappedSheet);
          }

          range.load(
            "address,addressLocal,cellCount,columnCount,columnHidden,columnIndex,conditionalFormats,dataValidation,format,formulas,formulasLocal,formulasR1C1,hasSpill,height,hidden,hyperlink,isEntireColumn,isEntireRow,left,linkedDataTypeState,numberFormat,numberFormatCategories,numberFormatLocal,rowCount,rowHidden,rowIndex,savedAsArray,sort,style,text,top,valueTypes,values"
          );

          await context.sync();

          console.log("range:", range);
        }

        console.log("Mapped Sheets:", mappedSheets);
        console.log("PDF Sheets:", pdfSheets);

        console.log(generateTypescript(mappedSheets));
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div>
      <h1>Export</h1>
      {contextHolder}

      <Button
        onClick={() => {
          exportDocument();
        }}
      >
        Export
      </Button>
    </div>
  );
};

export default ExportHandler;
