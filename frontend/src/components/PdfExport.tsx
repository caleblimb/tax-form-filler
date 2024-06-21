import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { FC, useState, useEffect } from "react";

type PdfExportProps = {
  fileName: string;
  cardName: string;
  formData: any[];
};

const PdfExport: FC<PdfExportProps> = ({
  fileName,
  cardName,
  formData,
}: PdfExportProps) => {
  const onClick = () => {
    console.log(formData);
  };
  return (
    <div className="pdf-export">
      <Card hoverable style={{ width: 240 }} onClick={() => onClick()}>
        <Meta title={cardName} description={fileName} />
      </Card>
    </div> //data-entry-monolith
  );
};

export default PdfExport;
