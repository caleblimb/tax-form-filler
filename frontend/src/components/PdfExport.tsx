import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import download from "downloadjs";
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFForm,
  PDFPage,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
} from "pdf-lib";
import { FC, useState, useEffect } from "react";

type PdfExportProps = {
  fileName: string;
  cardName: string;
  formData: string[];
};

const PdfExport: FC<PdfExportProps> = ({ fileName, cardName, formData }: PdfExportProps) => {
  const downloadPdf = async () => {
    const pdf = await fetch(require("../data-entry-monolith/pdf/" + fileName));
    const pdfBytes: ArrayBuffer = await pdf.arrayBuffer();
    const pdfDoc: PDFDocument = await PDFDocument.load(pdfBytes);
    // const pages: PDFPage[] = pdfDoc.getPages();
    // const pageCount: number = pages.length;
    const form: PDFForm = pdfDoc.getForm();
    const formFields: PDFField[] = form.getFields();

    for (let i = 0; i < formFields.length && i < formData.length; i++) {
      const field = formFields[i];
      const value = formData[i];
      if (field instanceof PDFTextField) {
        (field as PDFTextField).setText(value);
      } else if (field instanceof PDFCheckBox) {
        if (value.toLocaleLowerCase() === "true") {
          (field as PDFCheckBox).check();
        }
      } else if (field instanceof PDFDropdown) {
        //TODO: Handle dropdown field type
        console.error("Dropdowns are not supported yet!");
      } else if (field instanceof PDFRadioGroup) {
        //TODO: Handle radio group field type
        console.error("Radio Groups are not supported yet!");
      } else if (field instanceof PDFSignature) {
        //TODO: Handle signature field type
        console.error("Signatures are not supported yet!");
      }
    }

    const doc: Uint8Array = await pdfDoc.save();
    download(doc, fileName, "application/pdf");
  };

  const onClick = () => {
    console.log(formData);
    downloadPdf();
  };
  return (
    <div className="pdf-export">
      <Card
        hoverable
        style={{ width: 200 }}
        onClick={() => onClick()}
        cover={<img alt={cardName} src={require("../data-entry-monolith/pdf/" + fileName + ".png")} />}
      >
        <Meta title={cardName} description={fileName} />
      </Card>
    </div> //data-entry-monolith
  );
};

export default PdfExport;
