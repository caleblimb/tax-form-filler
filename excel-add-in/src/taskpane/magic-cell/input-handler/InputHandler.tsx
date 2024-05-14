//* global console */
import React, { FC, useState } from "react";
import { MagicCell } from "../CellHandler";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";

interface InputHandlerProps {
  cell: MagicCell;
  setCellContent: (cell: InputCell) => void;
}

export interface InputCell {
  type?: "text" | "number" | "currency" | "date" | "dropdown" | "radio";
  min?: number;
  max?: number;
  decimalScale?: number;
  options?: string[];
}

const InputHandler: FC<InputHandlerProps> = ({ cell, setCellContent }: InputHandlerProps) => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "text"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "text" });
            }}
          />
          Text
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "number"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "number" });
            }}
          />
          Number
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "currency"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "currency" });
            }}
          />
          Currency
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "date"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "date" });
            }}
          />
          Date
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "dropdown"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "dropdown" });
            }}
          />
          Dropdown
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="input"
            checked={cell?.content?.type === "radio"}
            onChange={() => {
              setCellContent({ ...cell.content, type: "radio" });
            }}
          />
          Radio Button
        </label>
      </div>

      <div>
        {cell?.content?.type === "text" && (
          <div>
            <label>
              <input type="number" onChange={(e) => setCellContent({ ...cell.content, min: +e.target.value })} />
              Min Length
            </label>

            <br />

            <label>
              <input type="number" onChange={(e) => setCellContent({ ...cell.content, max: +e.target.value })} />
              Max Length
            </label>
          </div>
        )}

        {cell?.content?.type === "number" && (
          <div>
            <label>
              Min Value
              <input type="number" onChange={(e) => setCellContent({ ...cell.content, min: +e.target.value })} />
            </label>

            <label>
              Max Value
              <input type="number" onChange={(e) => setCellContent({ ...cell.content, max: +e.target.value })} />
            </label>
          </div>
        )}

        {cell?.content?.type === "currency" && (
          <div>
            Round to nearest <br />
            <label>
              Dollar
              <input
                type="radio"
                checked={cell?.content?.decimalScale === 0}
                onChange={() => {
                  setCellContent({ ...cell.content, decimalScale: 0 });
                }}
              />
            </label>
            <label>
              Cent
              <input
                type="radio"
                checked={cell?.content?.decimalScale === 2}
                onChange={() => {
                  setCellContent({ ...cell.content, decimalScale: 2 });
                }}
              />
            </label>
          </div>
        )}

        {(cell?.content?.type === "dropdown" || cell?.content?.type === "radio") && (
          <div>
            {cell.content.options?.map((option, index) => (
              <div key={"option-input-" + index}>
                <label>
                  {index}:
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      setCellContent({
                        ...cell.content,

                        options: [
                          ...(cell.content?.options?.slice(0, index) ?? []),

                          e.target.value,

                          ...(cell.content?.options?.slice(index + 1, cell.content?.options.length) ?? []),
                        ],
                      });
                    }}
                  />
                </label>

                <button
                  type="button"
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
                </button>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={() => {
                  const updatedOptions = {
                    ...cell.content,

                    options: [...(cell.content?.options ?? []), ""],
                  };

                  setCellContent(updatedOptions);
                }}
              >
                Add +
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2>Preview:</h2>

        <div>
          {cell?.content?.type === "text" && (
            <label>
              <input type="text" />
              Example
            </label>
          )}

          {cell?.content?.type === "number" && (
            <label>
              <input type="number" min={cell.content.min} max={cell.content.max} />
              Example
            </label>
          )}

          {cell?.content?.type === "currency" && (
            <NumericFormat prefix="$" thousandSeparator decimalScale={cell.content.decimalScale} />
          )}

          {cell?.content?.type === "date" && (
            <DatePicker showIcon selected={startDate} onChange={(date: Date) => setStartDate(date)} />
          )}

          {cell?.content?.type === "dropdown" && (
            <label>
              Options
              <select>
                {cell.content.options?.map((option, index) => (
                  <option key={"option-select-" + index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )}

          {cell?.content?.type === "radio" && (
            <div>
              {cell.content.options?.map((option, index) => (
                <span key={"radio-select-" + index}>
                  <label>
                    <input type="radio" value="input" name="radio-example" />

                    {option}
                  </label>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
