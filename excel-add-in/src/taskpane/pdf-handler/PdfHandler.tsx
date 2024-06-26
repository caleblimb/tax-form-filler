/* global console */
/* global setTimeout */
/* global Excel */

import React, { FC } from "react";
import FileLoader from "../components/FileLoader";
import { pdfjs } from "react-pdf";
import { convertToBase64 } from "../utilities/Png";
import { PDFDocument, PDFField, PDFForm, PDFPage, PDFWidgetAnnotation } from "pdf-lib";
import { ExportHandler } from "../export/ExportHandler";
import { uploadPdf } from "../../api/frontend";
import { createSheetsPropsContainer } from "../sheet-handler/SheetHandler";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const colors: string[] = ["f94144", "90be6d", "f9844a", "4d908e", "f3722c", "577590", "f9c74f", "277da1"];
const colorsLight: string[] = ["ff8184", "d0fead", "ffc48a", "8dd0ce", "ffb26c", "97b5d0", "ffe78f", "67bde1"];
const IMAGE_TAG_: string = "pdf-image-";

interface PdfHandlerProps {
  LIVE_SERVER: ExportHandler;
}

const LEFT_MARGIN = 8;

const PdfHandler: FC<PdfHandlerProps> = ({ LIVE_SERVER }: PdfHandlerProps) => {
  const onLoadFile = async (file: File) => {
    uploadPdf(file);
    await createDocument(file);

    const bytes: ArrayBuffer = await file.arrayBuffer();
    const pdfDocument: PDFDocument = await PDFDocument.load(bytes);
    const pdfPages: PDFPage[] = pdfDocument.getPages();

    pdfPages.length;

    let offset = 0;
    const pageHeights = pdfPages.map((page, index) => {
      const height = page.getHeight();
      const width = page.getWidth();
      addPageImage(file, { num: index + 1, width, height, yOffset: offset });
      offset += height;
      return page.getHeight();
    });

    const maxWidth = pdfPages.reduce((acc: number, cur: PDFPage) => {
      const width = cur.getWidth();
      return width > acc ? width : acc;
    }, 0);

    setBColumnWidth(maxWidth);
    addConnections(pdfDocument, pdfPages, pageHeights);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await Excel.run(async (context) => {
      let shapes = context.workbook.worksheets.getActiveWorksheet().shapes;

      pdfPages.forEach((_page, index) => {
        const pageNumber = index + 1;
        const pageImage = shapes.getItem(IMAGE_TAG_ + pageNumber);
        pageImage.setZOrder(Excel.ShapeZOrder.sendToBack);
      });

      await context.sync();
    });
    LIVE_SERVER.handleChange();
  };

  const createDocument = async (file: File) => {
    await Excel.run(async (context) => {
      const worksheets = context.workbook.worksheets;
      const newWorksheet = worksheets.add(file.name);
      newWorksheet.activate();
      createSheetsPropsContainer(context, newWorksheet, true, file.name);
      await context.sync();
    });
  };

  const setBColumnWidth = async (width: number) => {
    try {
      await Excel.run(async (context) => {
        const columnB = context.workbook.worksheets.getActiveWorksheet().getRange("B1");
        columnB.format.columnWidth = width + LEFT_MARGIN;
        await context.sync();
      });
    } catch (error) {
      console.error("Error setting column width:", error);
    }
  };

  const addConnections = async (pdfDocument: PDFDocument, pdfPages: PDFPage[], pageHeights: number[]) => {
    const pdfForm: PDFForm = pdfDocument.getForm();
    const pdfFormFields: PDFField[] = pdfForm.getFields();
    pdfFormFields.map((field: PDFField, index: number): void => {
      const pageNumber: number = getPageNumberOfField(pdfDocument, pdfPages, field);
      const widgets: PDFWidgetAnnotation[] = field.acroField.getWidgets();
      const rect:
        | {
            x: number;
            y: number;
            width: number;
            height: number;
          }
        | undefined = widgets[0].Rect()?.asRectangle();

      const pageOffset = pageHeights.reduce((acc, cur, index) => (index + 1 < pageNumber ? acc + cur : acc), 0);

      if (rect) {
        const cell = index + 1;
        addLine(
          cell,
          {
            x: rect.x + rect.width / 2,
            y: pageOffset + pageHeights[pageNumber - 1] - rect.y - rect.height / 2,
          },
          colors[index % colors.length]
        );

        addRect(
          cell,
          { ...rect, y: pageOffset + pageHeights[pageNumber - 1] - rect.y },

          colorsLight[index % colors.length]
        );
      }
    });
  };

  const addLine = async (cell: number, position: { x: number; y: number }, color: string, attempt: number = 0) => {
    try {
      await Excel.run(async (context) => {
        const shapes = context.workbook.worksheets.getActiveWorksheet().shapes;
        const cellRange = context.workbook.worksheets.getActiveWorksheet().getRange("A" + cell);
        cellRange.load("left, top, width, height");

        await context.sync();

        const line = shapes.addLine(
          cellRange.left + cellRange.width,
          cellRange.top + cellRange.height / 2,
          cellRange.left + cellRange.width + position.x + LEFT_MARGIN,
          position.y,
          Excel.ConnectorType.straight
        );
        line.name = "ConnectionLine:" + cell;
        line.lineFormat.color = color;
        // line.lineFormat.weight = 0.25;
        line.lineFormat.style = "ThickThin";
        line.setZOrder(Excel.ShapeZOrder.bringToFront);

        await context.sync();
      });
    } catch (error) {
      const maxAttempts: number = 32;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, (position.y / 10) * attempt));
        await addLine(cell, position, color, attempt + 1);
      } else {
        console.error(error);
      }
    }
  };

  const addRect = async (
    cell: number,
    rect: { x: number; y: number; width: number; height: number },
    color: string,
    attempt: number = 0
  ) => {
    try {
      await Excel.run(async (context) => {
        let shapes = context.workbook.worksheets.getActiveWorksheet().shapes;
        const cellRange = context.workbook.worksheets.getActiveWorksheet().getRange("A1");
        cellRange.load("width");

        await context.sync();

        const shape = shapes.addGeometricShape(Excel.GeometricShapeType.rectangle);
        shape.left = cellRange.width + rect.x + LEFT_MARGIN;
        shape.top = rect.y - rect.height;
        shape.width = rect.width;
        shape.height = rect.height;
        shape.name = "ConnectionRect" + cell;
        shape.fill.foregroundColor = color;
        shape.setZOrder(Excel.ShapeZOrder.sendToBack);

        await context.sync();

        shape.setZOrder(Excel.ShapeZOrder.bringForward);

        await context.sync();
      });
    } catch (error) {
      const maxAttempts: number = 32;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, (rect.y / 10) * attempt));
        await addRect(cell, rect, color, attempt + 1);
      } else {
        console.error(error);
      }
    }
  };

  const addPageImage = async (
    file: File,
    page: { num: number; width: number; height: number; yOffset: number },
    attempt: number = 0
  ) => {
    const png64 = await convertToBase64(file, page.num);

    if (png64)
      try {
        await Excel.run(async (context) => {
          const cellRange = context.workbook.worksheets.getActiveWorksheet().getRange("B1");
          cellRange.load("left, top");

          await context.sync();

          const sheet = context.workbook.worksheets.getActiveWorksheet();
          const startIndex = png64.indexOf("base64,");
          const image = sheet.shapes.addImage(png64.substr(startIndex + 7));
          image.name = IMAGE_TAG_ + page.num;
          image.top = cellRange.top + page.yOffset;
          image.left = cellRange.left + LEFT_MARGIN;
          image.width = page.width;
          image.height = page.height;
          image.setZOrder(Excel.ShapeZOrder.sendToBack);

          await context.sync();
        });
      } catch (error) {
        const maxAttempts: number = 32;
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, page.num * 100 * attempt));
          await addPageImage(file, page, attempt + 1);
        } else {
          console.error(error);
        }
      }
  };

  const getPageNumberOfField = (pdfDoc: PDFDocument, pages: PDFPage[], field: PDFField): number => {
    const fieldPage = pdfDoc.findPageForAnnotationRef(field.ref);
    const pageNumber = pages.reduce((acc, page, index) => (fieldPage === page ? index + 1 : acc), -1);
    return pageNumber;
  };

  return (
    <div>
      <h1>Manage PDF</h1>
      <FileLoader contentTypes={["application/pdf"]} label=".pdf" onLoadFile={onLoadFile} />
    </div>
  );
};

export default PdfHandler;
