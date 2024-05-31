/* global Excel */
//* global setTimeout */
/* global console */
import { Button } from "antd";
import React, { FC } from "react";
import { SheetPage } from "../../../../shared/SheetPage";
import { Cell } from "../../../../shared/Cell";
import { PdfMap } from "../../../../shared/PdfMap";

const nextExcelColumnCode = (column: string): string => {
  const n: number = column.length;
  const charCodeA: number = "A".charCodeAt(0);
  const charCodeZ: number = "Z".charCodeAt(0);

  let carry: number = 1; // Start with a carry to increment the column
  let nextColumn: string = "";

  for (let i: number = n - 1; i >= 0; i--) {
    let currentChar: number = column.charCodeAt(i);

    // Add carry to the current character
    let newChar: number = currentChar + carry;
    if (newChar > charCodeZ) {
      newChar = charCodeA;
      carry = 1; // Carry over to the next significant digit
    } else {
      carry = 0; // No carry over needed
    }

    nextColumn = String.fromCharCode(newChar) + nextColumn;
  }

  // If there is still a carry after processing all characters, add a new 'A' at the front
  if (carry === 1) {
    nextColumn = "A" + nextColumn;
  }

  return nextColumn;
};

const unfoldFormula = (sheetName: string, formula: string): string => {
  let result = formula;

  // Simplify
  result = result.toUpperCase();

  // Add single quotes to sheet names that don't already have them
  result = result.replace(/[A-Z\d]{1,}![A-Z]{1,}\d{1,}[^!]/g, (match) => {
    const [name, cell] = match.split("!");
    return "'" + name + "'!" + cell;
  });

  // Add missing sheet names
  result = result.replace(/[^A-Z!:'][A-Z]{1,}\d{1,}[^!]/g, (match) => {
    return match.substring(0, 1) + "'" + sheetName + "'!" + match.substring(1);
  });

  result = result.replace(/'(('')|[^']){1,}'![A-Z]{1,}\d{1,}:[A-Z]{1,}\d{1,}/g, (match) => {
    const namePortion: string = match.match(/'(('')|[^']){1,}'!/g)![0];
    const cellPortion: string = match.match(/[A-Z]{1,}\d{1,}:[A-Z]{1,}\d{1,}/g)![0];
    const [startCell, endCell] = cellPortion.split(":");
    const startCol: string = startCell.match(/[A-Z]{1,}/g)![0];
    const startRow: number = +startCell.match(/\d{1,}/g)![0];
    const endCol: string = endCell.match(/[A-Z]{1,}/g)![0];
    const endRow: number = +endCell.match(/\d{1,}/g)![0];

    const cellList: string[] = [];

    for (let row: number = startRow; row < endRow; row++) {
      for (let col: string = startCol; col != endCol; col = nextExcelColumnCode(col)) {
        cellList.push(namePortion + col + row);
      }
    }

    return cellList.join(",");
  });

  result = result.replace("''", "'");

  return result;
};

const ExportHandler: FC = () => {
  const exportDocument = async () => {
    try {
      Excel.run(async (context) => {
        const worksheets = context.workbook.worksheets;
        worksheets.load("items");

        await context.sync();

        const items = worksheets.items;
        let mappedSheets: SheetPage[] = [];
        let pdfSheets: PdfMap[] = [];

        for (let i = 0; i < items.length; i++) {
          const sheet = items[i];
          const range = sheet.getUsedRange();

          const bracketsRegex = /{.*}/;
          const isPdfSheet = bracketsRegex.test(sheet.name);

          if (isPdfSheet) {
            range.load("formulas");

            await context.sync();

            const connections = range.formulas.map((row) =>
              row[0][0] === "=" ? unfoldFormula(sheet.name, row[0]) : row[0]
            );
            const pdfSheet = {
              fileName: sheet.name.replace(/[{}]/g, ""),
              connections: connections,
            };
            pdfSheets.push(pdfSheet);
          } else {
            range.load("formulas,columnIndex,rowIndex");
            sheet.comments.load("items");

            await context.sync();

            const comments = sheet.comments.items;
            const xOffset: number = range.columnIndex;
            const yOffset: number = range.rowIndex;
            let mappedComments: Map<string, string> = new Map<string, string>();

            for (let c = 0; c < comments.length; c++) {
              const location = comments[c].getLocation();
              location.load("columnIndex,rowIndex");

              await context.sync();

              const key: string = location.columnIndex + ":" + location.rowIndex;
              mappedComments.set(key, comments[c].content);
            }

            const mappedCells: Cell[][] = range.formulas.map((row, y: number): Cell[] => {
              return row.map((value, x: number): Cell => {
                const xPosition = xOffset + x;
                const yPosition = yOffset + y;
                const positionKey = xPosition + ":" + yPosition;

                const attributes = mappedComments.get(positionKey);
                let mappedAttributes;
                try {
                  mappedAttributes = JSON.parse(attributes!);
                } catch {
                  mappedAttributes = undefined;
                }

                return {
                  key: sheet.name + ":" + positionKey,
                  value: value,
                  formula: value[0] === "=" ? unfoldFormula(sheet.name, value) : undefined,
                  attributes: mappedAttributes,
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
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div>
      <h1>Export</h1>

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
