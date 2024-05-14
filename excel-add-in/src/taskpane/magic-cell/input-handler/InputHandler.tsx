//* global console */
import React, { FC } from "react";
import { MagicCell } from "../CellHandler";
import { DatePicker, InputNumber, Switch } from "antd";
// import type { RadioChangeEvent } from "antd";
import { Radio, Input, Button, Space, Select } from "antd";

interface InputHandlerProps {
  cell: MagicCell;
  setCellContent: (cell: InputCell) => void;
}

export interface InputCell {
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  min?: number;
  max?: number;
  formatAsCurrency?: boolean;
  options?: string[];
}

const inputOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Radio", value: "radio" },
];

const InputHandler: FC<InputHandlerProps> = ({ cell, setCellContent }: InputHandlerProps) => {
  return (
    <div>
      <div>
        <Radio.Group
          options={inputOptions}
          onChange={({ target: { value } }) => {
            setCellContent({ ...cell.content, type: value });
          }}
          value={cell.content?.type}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <div>
        {cell?.content?.type === "text" && (
          <div>
            <label>
              Min Length
              <InputNumber
                min={0}
                onChange={(value) => {
                  if (value) setCellContent({ ...cell.content, min: value as number });
                }}
              />
            </label>

            <br />

            <label>
              Max Length
              <InputNumber
                onChange={(value) => {
                  if (value) setCellContent({ ...cell.content, max: value as number });
                }}
              />
            </label>
          </div>
        )}

        {cell?.content?.type === "number" && (
          <div>
            <label>
              Min Value
              <InputNumber
                onChange={(value) => {
                  if (value) setCellContent({ ...cell.content, min: value as number });
                }}
              />
            </label>

            <br />

            <label>
              Max Value
              <InputNumber
                onChange={(value) => {
                  if (value) setCellContent({ ...cell.content, max: value as number });
                }}
              />
            </label>
            <br />
            <label>
              Format as currency
              <Switch onChange={(checked: boolean) => setCellContent({ ...cell.content, formatAsCurrency: checked })} />
            </label>
          </div>
        )}

        {(cell?.content?.type === "dropdown" || cell?.content?.type === "radio") && (
          <div>
            {cell.content.options?.map((option, index) => (
              <div key={"option-input-" + index}>
                <Space.Compact>
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
              </div>
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
                Add +
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2>Preview:</h2>

        <div>
          {cell?.content?.type === "text" && (
            <label>
              Example
              <Input type="text" />
            </label>
          )}

          {cell?.content?.type === "number" && (
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

          {cell?.content?.type === "date" && <DatePicker />}

          {cell?.content?.type === "dropdown" && (
            <Select
              allowClear
              options={cell.content.options?.map((option) => {
                return { value: option, label: option };
              })}
            />
          )}

          {cell?.content?.type === "radio" && (
            <Radio.Group
              options={cell.content.options?.map((option) => {
                return { value: option, label: option };
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
