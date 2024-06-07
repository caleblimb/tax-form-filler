import { FC } from "react";
import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
import { Cell } from "../../../shared/Cell";
import { CellData } from "../App";
import "./DataCell.scss";

type DataCellProps = {
  cell: Cell;
  handleChange: (key: string, change?: string) => void;
  dataState?: Map<string, CellData>;
};

const DataCell: FC<DataCellProps> = ({ cell, handleChange, dataState }: DataCellProps) => {
  return (
    <div className="data-cell">
      {cell.attributes && (
        <>
          {cell.attributes.type === "input" && (
            <>
              {cell.attributes.content?.type === "text" && (
                <Input type="text" onChange={(e) => handleChange(cell.key, e.target.value)} />
              )}
              {cell.attributes.content?.type === "number" &&
                (cell.attributes.content.formatAsCurrency ? (
                  <InputNumber<number>
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                    onChange={(e) => handleChange(cell.key, e?.toString())}
                  />
                ) : (
                  <Input
                    type="number"
                    min={cell.attributes.content.min}
                    max={cell.attributes.content.max}
                    onChange={(e) => handleChange(cell.key, e.target.value)}
                  />
                ))}
              {cell.attributes.content?.type === "date" && <DatePicker />} {/* TODO: Handle Date Update */}
              {cell.attributes.content?.type === "dropdown" && (
                <Select
                  style={{ minWidth: "10rem" }}
                  allowClear
                  options={cell.attributes.content.options?.map((option, index) => {
                    return { value: option + index, label: option };
                  })}
                  onChange={(e) => handleChange(cell.key, e.target.value)}
                />
              )}
              {cell.attributes.content?.type === "radio" && (
                <Radio.Group
                  options={cell.attributes.content.options?.map((option, index) => {
                    return { value: option + index, label: option };
                  })}
                  onChange={(e) => handleChange(cell.key, e.target.value)}
                />
              )}
            </>
          )}
        </>
      )}
      {cell.formula ? (
        <>
          {cell.key}:{dataState?.get(cell.key)?.value}
        </>
      ) : (
        <>{cell.value}</>
      )}
    </div>
  );
};

export default DataCell;
