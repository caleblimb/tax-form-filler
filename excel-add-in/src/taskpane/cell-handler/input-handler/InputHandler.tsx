//* global console */
import React, { FC } from "react";
import { DatePicker, InputNumber, Switch } from "antd";
// import type { RadioChangeEvent } from "antd";
import { Radio, Input, Button, Space, Select } from "antd";
import { CustomAttributes } from "../../types/CustomAttributes";
import { InputAttributes } from "../../types/InputAttributes";

interface InputHandlerProps {
  cell: CustomAttributes;
  setCellContent: (cell: InputAttributes) => void;
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
            if (value === "dropdown" || value === "radio") {
              setCellContent({ type: value, options: [""] });
            } else {
              setCellContent({ type: value });
            }
          }}
          value={cell.content?.type}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <hr />

      <Space direction="vertical">
        {cell?.content?.type === "text" && (
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

        {cell?.content?.type === "number" && (
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

        {(cell?.content?.type === "dropdown" || cell?.content?.type === "radio") && (
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
    </div>
  );
};

export default InputHandler;
