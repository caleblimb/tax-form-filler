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
              row[0][0] === "=" ? unfoldFormula(sheet.name, sheetNames, row[0]) : row[0],
            );
            const pdfSheet = {
              fileName: sheet.name.replace(/[{}]/g, ""),
              connections: connections,
            };
            pdfSheets.push(pdfSheet);
          } else {
            range.load("formulas,columnIndex,rowIndex,address");
            sheet.comments.load("items");
            const mergedAreas = range.getMergedAreasOrNullObject();
            mergedAreas.load("areas");

            await context.sync();

            const comments = sheet.comments.items;
            const xOffset: number = range.columnIndex;
            const yOffset: number = range.rowIndex;
            const rowAddress: number = +range.address.match(/![A-Z]+\d+/g)![0].match(/\d+/g)![0];
            const colAddress: string = range.address.match(/![A-Z]+\d+/g)![0].match(/[A-Z]+/g)![0];

            let mappedComments: Map<string, string> = new Map<string, string>();
            let mappedCellSpans: Map<string, { col: number; row: number }> = new Map<
              string,
              { col: number; row: number }
            >();
            let cellsToSkip: Set<string> = new Set<string>();

            for (let a = 0; a < mergedAreas.areas.items.length; a++) {
              const area = mergedAreas.areas.items[a];
              const address: string = area.address.match(/![A-Z]+\d+/g)![0].match(/[A-Z]+\d+/g)![0];
              mappedCellSpans.set(address, { col: area.columnCount, row: area.rowCount });

              const startRow: number = +address.match(/\d+/g)![0];
              let currentColumn: string = address.match(/[A-Z]+/g)![0];
              for (let col: number = 0; col < area.columnCount; col++) {
                for (let row: number = 0; row < area.rowCount; row++) {
                  const currentRow = startRow + row;
                  cellsToSkip.add(currentColumn + currentRow);
                }
                currentColumn = nextExcelColumnCode(currentColumn);
              }
            }

            for (let c = 0; c < comments.length; c++) {
              const location = comments[c].getLocation();
              location.load("columnIndex,rowIndex");

              await context.sync();

              const key: string = location.columnIndex + ":" + location.rowIndex;
              mappedComments.set(key, comments[c].content);
            }

            let mappedCells: Cell[][] = [];
            for (let y = 0; y < range.formulas.length; y++) {
              const row = range.formulas[y];
              const cols: string[] = [colAddress];
              let mappedRow: Cell[] = [];
              for (let x = 0; x < row.length; x++) {
                const value = row[x];
                const xPosition = xOffset + x;
                const yPosition = yOffset + y;
                const positionKey = xPosition + ":" + yPosition;
                const rowNumber = rowAddress + y;
                if (cols.length === x) {
                  cols.push(nextExcelColumnCode(cols[cols.length - 1]));
                }

                let colSpan: number = 1;
                let rowSpan: number = 1;
                const span = mappedCellSpans.get(cols[x] + rowNumber);
                if (span) {
                  rowSpan = span.row;
                  colSpan = span.col;
                } else {
                  if (cellsToSkip.has(cols[x] + rowNumber)) {
                    continue;
                  }
                }

                const attributes = mappedComments.get(positionKey);
                let mappedAttributes;
                try {
                  mappedAttributes = JSON.parse(attributes!);
                } catch {
                  mappedAttributes = undefined;
                }

                const cell = {
                  key: "'" + encodeSheetName(sheet.name) + "'!" + cols[x] + rowNumber,
                  value: value,
                  formula: value[0] === "=" ? unfoldFormula(sheet.name, sheetNames, value) : undefined,
                  attributes: mappedAttributes,
                  set: "set_" + encodeSheetName(sheet.name) + "_" + cols[x] + rowNumber,
                  get: "get_" + encodeSheetName(sheet.name) + "_" + cols[x] + rowNumber,
                  rowSpan: rowSpan,
                  colSpan: colSpan,
                };
                mappedRow.push(cell);
              }
              mappedCells.push(mappedRow);
            }

            const mappedSheet: SheetPage = {
              name: sheet.name,
              cells: mappedCells,
            };

            mappedSheets.push(mappedSheet);
          }

          range.load(
            "address,addressLocal,cellCount,columnCount,columnHidden,columnIndex,conditionalFormats,dataValidation,format,formulas,formulasLocal,formulasR1C1,hasSpill,height,hidden,hyperlink,isEntireColumn,isEntireRow,left,linkedDataTypeState,numberFormat,numberFormatCategories,numberFormatLocal,rowCount,rowHidden,rowIndex,savedAsArray,sort,style,text,top,valueTypes,values",
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
