/* global console */
/* global Excel */

import { SheetPage } from "../types/SheetPage";
import { PdfMap } from "../types/PdfMap";
import { Cell } from "../types/Cell";
import { encodeSheetName, nextExcelColumnCode, unfoldFormula } from "./ExportUtilities";
import { exportToFrontend } from "../../api/frontend";
import { generateTypescript } from "./DataEntryMonolithBuilder";
import { SHEET_PROPERTIES, SheetProperties } from "../types/SheetProperties";
import { formatHorizontalAlignment, formatUnderline } from "../types/ExcelFormatMaps";
import { getSheetProperties } from "../sheet-handler/SheetHandler";

export class ExportHandler {
  private latestController: AbortController | null = null;
  private updateProgress: (progress: number) => void;

  constructor(updateProgress: (progress: number) => void) {
    this.updateProgress = updateProgress;
  }

  async handleChange() {
    // Cancel the previous request if it's still ongoing
    if (this.latestController) {
      this.latestController.abort();
    }

    // Create a new AbortController for the current request
    this.latestController = new AbortController();
    const { signal } = this.latestController;

    try {
      // Simulate processing
      const result = await this.buildWebpage(signal);

      // If processing is successful, write the result to a file
      await this.writeToFile(result);

      console.log("Successfully wrote the result to the file.");
      this.updateProgress(1);
    } catch (error: any) {
      this.updateProgress(0);
      if (error.name === "AbortError") {
        console.log("Processing was aborted.");
      } else {
        console.error("An error occurred during processing:", error);
      }
    } finally {
      // Clear the controller after processing is done
      this.latestController = null;
    }
  }

  private async mapComments(context: Excel.RequestContext, comments: Excel.Comment[]): Promise<Map<string, string>> {
    let mappedComments: Map<string, string> = new Map<string, string>();

    const locations = comments.map((comment) => {
      const location = comment.getLocation();
      location.load("columnIndex,rowIndex");
      return location;
    });

    await context.sync();

    for (let c = 0; c < comments.length; c++) {
      const key: string = locations[c].columnIndex + ":" + locations[c].rowIndex;
      mappedComments.set(key, comments[c].content);
    }
    return mappedComments;
  }

  private mapCellSpans(ranges: Excel.Range[]): Map<string, { col: number; row: number }> {
    let mappedCellSpans: Map<string, { col: number; row: number }> = new Map<string, { col: number; row: number }>();

    for (let a = 0; a < ranges.length; a++) {
      const area = ranges[a];
      const address: string = area.address.match(/![A-Z]+\d+/g)![0].match(/[A-Z]+\d+/g)![0];
      mappedCellSpans.set(address, { col: area.columnCount, row: area.rowCount });
      const startRow: number = +address.match(/\d+/g)![0];
      let currentColumn: string = address.match(/[A-Z]+/g)![0];

      for (let col: number = 0; col < area.columnCount; col++) {
        for (let row: number = 0; row < area.rowCount; row++) {
          if (col === 0 && row === 0) continue;
          const currentRow = startRow + row;
          mappedCellSpans.set(currentColumn + currentRow, { col: 0, row: 0 });
        }
        currentColumn = nextExcelColumnCode(currentColumn);
      }
    }
    return mappedCellSpans;
  }

  private mapStyles(cell: Excel.Range): string {
    const textAlign = formatHorizontalAlignment.get(cell.format.horizontalAlignment);
    const fontWeight = cell.format.font.bold ? "bold" : "normal";
    const textDecoration = formatUnderline.get(cell.format.font.underline);
    const fontSize = cell.format.font.size;
    const backgroundColor = cell.format.fill.color;
    const color = cell.format.font.color;

    let styles: string = "{ ";

    if (textAlign) {
      styles += `textAlign: "${textAlign}", `;
    }
    if (fontWeight && fontWeight !== "normal") {
      styles += `fontWeight: "${fontWeight}", `;
    }
    if (textDecoration) {
      styles += `textDecoration: "${textDecoration}", `;
    }
    if (fontSize !== 11) {
      styles += `fontSize: "${fontSize}pt", `;
    }
    if (color != "#000000") {
      styles += `color: "${color}", `;
    }
    if (backgroundColor !== "#FFFFFF") {
      styles += `backgroundColor: "${backgroundColor}", `;
    }

    styles += "}";

    return styles;
  }

  private buildWebpage(signal: AbortSignal): Promise<string> {
    this.updateProgress(0);
    return new Promise(async (resolve, reject) => {
      let result: string = "";
      try {
        await Excel.run(async (context: Excel.RequestContext) => {
          const worksheets = context.workbook.worksheets;
          worksheets.load("items");

          await context.sync();

          const items = worksheets.items;
          let mappedSheets: SheetPage[] = [];
          let pdfSheets: PdfMap[] = [];

          // Make sure longer names are first to avoid name collision from regex
          const sheetNames = items.map((sheet) => sheet.name).sort((a, b) => b.length - a.length);

          for (let i = 0; i < items.length; i++) {
            const sheet = items[i];
            const range = sheet.getUsedRange();

            const sheetProperties: SheetProperties = await getSheetProperties(context, sheet);
            //   if (sheet.name.indexOf("!") > -1) {
            //     const errorMessage =
            //       "Invalid sheet name:" +
            //       sheet.name +
            //       "\n! is not allowed in Sheet Names as it can cause errors in formula parsing.";
            //     messageApi.open({ type: "error", content: errorMessage });
            //     throw new Error(errorMessage);
            //   }

            if (sheetProperties.isPDF) {
              range.load("formulas, address");

              await context.sync();

              const connections = range.formulas.map((row, index): Cell => {
                const isFormula = row[0][0] === "=";
                const [_, rangeAddress] = range.address.split("!");
                const address = rangeAddress.split(":")[0].replace(/\d+/, (match) => {
                  return (+match + index).toString();
                });
                return {
                  key: "'" + encodeSheetName(sheet.name) + "'!" + address,
                  value: isFormula ? undefined : row[0],
                  formula: isFormula ? unfoldFormula(sheet.name, sheetNames, row[0]) : undefined,
                  set: "set_" + encodeSheetName(sheet.name) + "_" + address,
                  get: "get_" + encodeSheetName(sheet.name) + "_" + address,
                  rowSpan: 1,
                  colSpan: 1,
                  style: "",
                };
              });

              const pdfSheet: PdfMap = {
                fileName: sheet.name.replace(/[{}]/g, ""),
                name: sheetProperties.tabName,
                connections: connections,
              };
              pdfSheets.push(pdfSheet);
            } else {
              range.load("formulas,columnIndex,rowIndex,address,rowCount,columnCount");
              sheet.comments.load("items");
              const mergedAreas = range.getMergedAreasOrNullObject();
              mergedAreas.load("areaCount, areas/items/address, areas/items/columnCount, areas/items/rowCount");

              await context.sync();

              const comments = sheet.comments.items;
              let mappedComments: Map<string, string> = await this.mapComments(context, comments);

              const mappedCellSpans =
                mergedAreas.areaCount > 0
                  ? this.mapCellSpans(mergedAreas.areas.items)
                  : new Map<string, { col: number; row: number }>();

              const rawCells: (
                | Excel.Range
                | { address: string; columnIndex: number; rowIndex: number; values: string[][]; formulas: string[][] }
              )[][] = [];
              for (let row = range.rowIndex; row < range.rowIndex + range.rowCount; row++) {
                const rawRow = [];
                let columnCode = range.address.match(/![A-Z]+/)![0].substring(1);
                for (let col = range.columnIndex; col < range.columnIndex + range.columnCount; col++) {
                  if (range.formulas[row - range.rowIndex][col - range.columnIndex] === "") { 
                    rawRow.push({
                      address: `!${columnCode}${row + range.rowIndex}`,
                      columnIndex: row + range.rowIndex,
                      rowIndex: col + range.columnIndex,
                      values: [[""]],
                      formulas: [[""]],
                    });
                  } else {// Possibly optimize further, this block is expensive to run
                    const cell = sheet.getCell(row, col);
                    cell.load(
                      "address, font, format, formulas, values, columnIndex, rowIndex" +
                        ",format/fill,format/font,format/horizontalAlignment,format/verticalAlignment"
                      // ",format/autoIndent,format/borders,format/columnWidth,format/context,format/fill,format/font,format/horizontalAlignment,format/indentLevel,format/isNull,format/isNullObject,format/protection,format/readingOrder,format/rowHeight,format/shrinkToFit,format/textOrientation,format/useStandardHeight,format/useStandardWidth,format/verticalAlignment,format/wrapText",
                    );
                    rawRow.push(cell);
                  }
                  columnCode = nextExcelColumnCode(columnCode);
                }
                rawCells.push(rawRow);
              }

              await context.sync();

              let mappedCells: Cell[][] = [];
              rawCells.forEach((row) => {
                let mappedRow: Cell[] = [];
                row.forEach((cell) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const [_, address] = cell.address.split("!");

                  let colSpan: number = 1;
                  let rowSpan: number = 1;
                  const span = mappedCellSpans.get(address);
                  if (span) {
                    if (span.col === 0 || span.row === 0) return;
                    colSpan = span.col;
                    rowSpan = span.row;
                  }

                  const positionKey = cell.columnIndex + ":" + cell.rowIndex;
                  const attributes = mappedComments.get(positionKey);
                  let mappedAttributes;
                  try {
                    mappedAttributes = JSON.parse(attributes!);
                  } catch {
                    mappedAttributes = undefined;
                  }

                  const cellFormula = cell.formulas[0][0];
                  const mappedCell: Cell = {
                    key: "'" + encodeSheetName(sheet.name) + "'!" + address,
                    value: cell.values[0][0],
                    formula:
                      cellFormula[0] === "=" ? unfoldFormula(sheet.name, sheetNames, cell.formulas[0][0]) : undefined,
                    attributes: mappedAttributes,
                    set: "set_" + encodeSheetName(sheet.name) + "_" + address,
                    get: "get_" + encodeSheetName(sheet.name) + "_" + address,
                    rowSpan: rowSpan,
                    colSpan: colSpan,
                    style: cellFormula === "" ? "" : this.mapStyles(cell as Excel.Range),
                  };
                  mappedRow.push(mappedCell);
                });
                mappedCells.push(mappedRow);
              });

              const mappedSheet: SheetPage = {
                name: sheetProperties.tabName,
                cells: mappedCells,
              };

              mappedSheets.push(mappedSheet);
            }

            // range.load(
            //   "address,addressLocal,cellCount,columnCount,columnHidden,columnIndex,conditionalFormats,dataValidation,format,formulas,formulasLocal,formulasR1C1,hasSpill,height,hidden,hyperlink,isEntireColumn,isEntireRow,left,linkedDataTypeState,numberFormat,numberFormatCategories,numberFormatLocal,rowCount,rowHidden,rowIndex,savedAsArray,sort,style,text,top,valueTypes,values",
            // );

            await context.sync();

            // console.log("range:", range);
            this.updateProgress(i / items.length);
          }

          //   console.log("Mapped Sheets:", mappedSheets);
          //   console.log("PDF Sheets:", pdfSheets);

          //   console.log(generateTypescript(mappedSheets));
          result = generateTypescript(mappedSheets, pdfSheets);
        });
      } catch (error) {
        console.log("Error: " + error);
      }
      // Immediately resolve unless aborted
      if (signal.aborted || result === "") {
        reject(new DOMException("Aborted", "AbortError"));
      } else {
        resolve(result);
      }
    });
  }

  private async writeToFile(text: string): Promise<void> {
    // Simulate writing to a file (replace this with actual file writing logic)
    return new Promise((resolve) => {
      console.log(`Writing text to file...`);
      exportToFrontend(text);
      resolve();
    });
  }
}
