/* global Excel */
//* global setTimeout */
/* global console */
import { Button } from "antd";
import React, { FC } from "react";

const ExportHandler: FC = () => {
  const exportDocument = async () => {
    try {
      Excel.run(async (context) => {
        const worksheets = context.workbook.worksheets;
        worksheets.load("items");

        await context.sync();

        const items = worksheets.items;
        let mappedSheets = [];
        let pdfSheets = [];

        for (let i = 0; i < items.length; i++) {
          const sheet = items[i];
          const range = sheet.getUsedRange();

          const bracketsRegex = /{.*}/;
          const isPdfSheet = bracketsRegex.test(sheet.name);

          if (isPdfSheet) {
            range.load("formulasR1C1");

            await context.sync();

            const connections = range.formulasR1C1.map((row) => row[0]);
            const pdfSheet = {
              fileName: sheet.name.replace(/[{}]/g, ""),
              connections: connections,
            };
            pdfSheets.push(pdfSheet);
          } else {
            range.load("formulasR1C1,columnIndex,rowIndex");
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

            const mappedCells = range.formulasR1C1.map((row, y: number) => {
              return row.map((value, x: number) => {
                const xPosition = xOffset + x;
                const yPosition = yOffset + y;
                const positionKey = xPosition + ":" + yPosition;

                return {
                  key: sheet.name + ":" + positionKey,
                  value: value,
                  attributes: mappedComments.get(positionKey) ?? "",
                };
              });
            });

            const mappedSheet = {
              name: sheet.name,
              cells: mappedCells,
            };

            mappedSheets.push(mappedSheet);
          }
        }

        console.log("Mapped Sheets:", mappedSheets);
        console.log("PDF Sheets:", pdfSheets);

        // range.load(
        //   "address,addressLocal,cellCount,columnCount,columnHidden,columnIndex,conditionalFormats,dataValidation,format,formulas,formulasLocal,formulasR1C1,hasSpill,height,hidden,hyperlink,isEntireColumn,isEntireRow,left,linkedDataTypeState,numberFormat,numberFormatCategories,numberFormatLocal,rowCount,rowHidden,rowIndex,savedAsArray,sort,style,text,top,valueTypes,values"
        // );

        // await context.sync();

        // console.log("range:", range);
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
