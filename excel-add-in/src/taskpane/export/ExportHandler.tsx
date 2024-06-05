/* global Excel */
//* global setTimeout */
/* global console */
/* global btoa */
import { Button, message } from "antd";
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

const unfoldFormula = (sheetName: string, sheetNames: string[], formula: string): string => {
  let result = formula;

  // Add single quotes to sheet names that don't already have them
  result = result.replace(/[A-Za-z\d]+![A-Za-z]+\d+[^!]/g, (match) => {
    const [name, cell] = match.split("!");
    return "'" + name + "'!" + cell;
  });

  // Remove double single quotes from sheet names
  result = result.replace(/('')/g, "'");

  // Encode sheet names to avoid parsing errors with symbols
  // TODO: This doesn't seem to work
  sheetNames.forEach((name) => {
    result.replace("'" + name + "'", "'" + encodeSheetName(name) + "'");
  });

  // TODO: make sure this is working right as well
  // Add missing sheet names
  result = result.replace(/[^A-Za-z!:'][A-Za-z]+\d+[^!]/g, (match) => {
    return match.substring(0, 1) + "'" + encodeSheetName(sheetName) + "'!" + match.substring(1);
  });

  // Unfold Cell Ranges
  result = result.replace(/'.+'![A-Za-z]+\d+:[A-Za-z]+\d+/g, (match) => {
    const namePortion: string = match.match(/'.+'!/)![0];
    const cellPortion: string = match.match(/[A-Za-z]+\d+:[A-Za-z]+\d+/)![0];
    const [startCell, endCell] = cellPortion.split(":");
    const startCol: string = startCell.match(/[A-Za-z]+/)![0];
    const startRow: number = +startCell.match(/\d+/)![0];
    const endCol: string = endCell.match(/[A-Za-z]+/)![0];
    const endRow: number = +endCell.match(/\d+/)![0];

    const cellList: string[] = [];

    for (let row: number = startRow; row < endRow; row++) {
      for (let col: string = startCol; col != endCol; col = nextExcelColumnCode(col)) {
        cellList.push(namePortion + col + row);
      }
    }

    return cellList.join(",");
  });

  return result;
};

const encodeSheetName = (name: string) => {
  return btoa(name).replace(/[=+/]/g, "");
};

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
            console.log("range", range.address);
            const rowAddress: number = +range.address.match(/![A-Z]+[1-9]+/g)![0].match(/[1-9]+/g)![0];
            console.log("rowAddress:", rowAddress);
            const colAddress: string = range.address.match(/![A-Z]+[1-9]+/g)![0].match(/[A-Z]+/g)![0];
            console.log("colAddress:", colAddress);
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
                console.log(sheetNames);

                return {
                  key: "'" + encodeSheetName(sheet.name) + "'!" + cols[x] + (rowAddress + y),
                  value: value,
                  formula: value[0] === "=" ? unfoldFormula(sheet.name, sheetNames, value) : undefined,
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
