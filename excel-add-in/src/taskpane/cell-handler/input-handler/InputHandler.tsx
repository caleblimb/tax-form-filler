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
        Required&nbsp;
        <Switch
          size="small"
          checked={cell.input?.required}
          onChange={(checked) => setCellContent({ ...cell.input, required: checked })}
        />
      </div>

      <hr />

      <div>
        <Radio.Group
          options={inputOptions}
          onChange={({ target: { value } }) => {
            if (value === "dropdown" || value === "radio") {
              setCellContent({ required: cell.input?.required, type: value, options: [""] });
            } else {
              setCellContent({ required: cell.input?.required, type: value });
            }
          }}
          value={cell.input?.type}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <hr />

      <Space direction="vertical">
        {cell?.input?.type === "text" && (
          <>
            <Space.Compact>
              <label>
                Min Length
                <InputNumber
                  min={0}
                  value={cell.input.min}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.input, min: value as number });
                  }}
                />
              </label>
            </Space.Compact>

            <Space.Compact>
              <label>
                Max Length
                <InputNumber
                  min={0}
                  value={cell.input.max}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.input, max: value as number });
                  }}
                />
              </label>
            </Space.Compact>
          </>
        )}

        {cell?.input?.type === "number" && (
          <>
            <Space.Compact>
              <label>
                Min Value
                <InputNumber
                  value={cell.input.min}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.input, min: value as number });
                  }}
                />
              </label>
            </Space.Compact>
            <Space.Compact>
              <label>
                Max Value
                <InputNumber
                  value={cell.input.max}
                  onChange={(value) => {
                    if (value) setCellContent({ ...cell.input, max: value as number });
                  }}
                />
              </label>
            </Space.Compact>
            <Space.Compact>
              <label>
                Format as currency&nbsp;
                <Switch
                  value={cell.input.formatAsCurrency}
                  onChange={(checked: boolean) => setCellContent({ ...cell.input, formatAsCurrency: checked })}
                />
              </label>
            </Space.Compact>
          </>
        )}

        {(cell?.input?.type === "dropdown" || cell?.input?.type === "radio") && (
          <>
            {cell.input.options?.map((option, index) => (
              <Space.Compact key={"option-input-" + index}>
                <Input
                  type="text"
                  value={option}
                  onChange={({ target: { value } }) => {
                    setCellContent({
                      ...cell.input,
                      options: [
                        ...(cell.input?.options?.slice(0, index) ?? []),
                        value,
                        ...(cell.input?.options?.slice(index + 1, cell.input?.options.length) ?? []),
                      ],
                    });
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setCellContent({
                      ...cell.input,
                      options: [
                        ...(cell.input?.options?.slice(0, index) ?? []),
                        ...(cell.input?.options?.slice(index + 1, cell.input?.options.length) ?? []),
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
                    ...cell.input,
                    options: [...(cell.input?.options ?? []), ""],
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
