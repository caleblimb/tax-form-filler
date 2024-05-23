//* global console */
import React, { FC } from "react";
import { DatePicker, InputNumber, Switch } from "antd";
// import type { RadioChangeEvent } from "antd";
import { Radio, Input, Button, Space, Select } from "antd";
import { MagicCell } from "../../../../../shared/MagicCell";
import { InputCell } from "../../../../../shared/InputCell";
import { InputType } from "../../../../../shared/InputType";

interface InputHandlerProps {
  cell: MagicCell;
  setCellContent: (cell: InputCell) => void;
}

const inputOptions = [
  { label: "Text", value: InputType.Text },
  { label: "Number", value: InputType.Number },
  { label: "Date", value: InputType.Date },
  { label: "Dropdown", value: InputType.Dropdown },
  { label: "Radio", value: InputType.Radio },
];

const InputHandler: FC<InputHandlerProps> = ({ cell, setCellContent }: InputHandlerProps) => {
  return (
    <div>
      <div>
        <Radio.Group
          options={inputOptions}
          onChange={({ target: { value } }) => {
            setCellContent({ type: value });
          }}
          value={cell.content?.type}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <hr />

      <Space direction="vertical">
        {cell?.content?.type === InputType.Text && (
          <>
            <Space.Compact>
              <label>
                Min Length
                <InputNumber
                  min={0}
                  value={cell.content.min}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.content, min: value as number });
                  }}
                />
              </label>
            </Space.Compact>

            <Space.Compact>
              <label>
                Max Length
                <InputNumber
                  min={0}
                  value={cell.content.max}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.content, max: value as number });
                  }}
                />
              </label>
            </Space.Compact>
          </>
        )}

        {cell?.content?.type === InputType.Number && (
          <>
            <Space.Compact>
              <label>
                Min Value
                <InputNumber
                  value={cell.content.min}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.content, min: value as number });
                  }}
                />
              </label>
            </Space.Compact>
            <Space.Compact>
              <label>
                Max Value
                <InputNumber
                  value={cell.content.max}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.content, max: value as number });
                  }}
                />
              </label>
            </Space.Compact>
            <Space.Compact>
              <label>
                Format as currency
                <Switch
                  value={cell.content.formatAsCurrency}
                  onChange={(checked: boolean) => setCellContent({ ...cell.content, formatAsCurrency: checked })}
                />
              </label>
            </Space.Compact>
          </>
        )}

        {(cell?.content?.type === InputType.Dropdown || cell?.content?.type === InputType.Radio) && (
          <>
            {cell.content.options?.map((option, index) => (
              <Space.Compact key={"option-input-" + index}>
                <Input
                  type="text"
                  value={option}
                  onChange={({ target: { value } }) => {
                    setCellContent({
                      ...cell.content,
                      options: [
                        ...(cell.content?.options?.slice(0, index) ?? []),
                        value,
                        ...(cell.content?.options?.slice(index + 1, cell.content?.options.length) ?? []),
                      ],
                    });
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setCellContent({
                      ...cell.content,
                      options: [
                        ...(cell.content?.options?.slice(0, index) ?? []),
                        ...(cell.content?.options?.slice(index + 1, cell.content?.options.length) ?? []),
                      ],
                    });
                  }}
                >
                  X
                </Button>
              </Space.Compact>
            ))}

            <div>
              <Button
                type="primary"
                onClick={() => {
                  const updatedOptions = {
                    ...cell.content,
                    options: [...(cell.content?.options ?? []), ""],
                  };
                  setCellContent(updatedOptions);
                }}
              >
                Add Option +
              </Button>
            </div>
          </>
        )}
      </Space>

      <hr />
      <div>
        <h2>Preview:</h2>

        <div>
          {cell?.content?.type === InputType.Text && (
            <label>
              Example
              <Input type="text" />
            </label>
          )}

          {cell?.content?.type === InputType.Number && (
            <label>
              Example
              {cell?.content.formatAsCurrency ? (
                <InputNumber<number>
                  defaultValue={1000}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                />
              ) : (
                <Input type="number" min={cell.content.min} max={cell.content.max} />
              )}
            </label>
          )}

          {cell?.content?.type === InputType.Date && <DatePicker />}

          {cell?.content?.type === InputType.Dropdown && (
            <Select
              style={{ minWidth: "10rem" }}
              allowClear
              options={cell.content.options?.map((option, index) => {
                return { value: option + index, label: option };
              })}
            />
          )}

          {cell?.content?.type === InputType.Radio && (
            <Radio.Group
              options={cell.content.options?.map((option, index) => {
                return { value: option + index, label: option };
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
