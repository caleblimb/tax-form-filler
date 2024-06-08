import React, { FC } from "react";
import { CellData } from "../App";
import { SheetPage } from "../../../shared/SheetPage";
import DataCell from "./DataCell";

type DataPageProps = {
  page: SheetPage;
  handleChange: (key: string, change?: string) => void;
  dataState?: Map<string, CellData>;
};

const DataPage: FC<DataPageProps> = ({ page, handleChange, dataState }: DataPageProps) => {
  return (
    <table>
      <tbody>
        {page.cells.map((row, rowIndex) => (
          <tr key={"row:" + rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cell.key + ":" + cellIndex}>
                <DataCell cell={cell} handleChange={handleChange} dataState={dataState} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataPage;
