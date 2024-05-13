/* global Excel */
/* global console */
import React, { FC, useEffect, useState } from "react";
import { CellRange } from "../App";
import InputHandler, { InputCell } from "./input-handler/InputHandler";

interface InputHandlerProps {
  title: string;
  range: CellRange | undefined;
}

export interface MagicCell {
  type: "input" | "message";
  content?: InputCell;
}

const CellHandler: FC<InputHandlerProps> = ({ title, range }: InputHandlerProps) => {
  const [cell, setCell] = useState<MagicCell>();
  useEffect(() => {
    if (range && range.cellCount === 1) {
      try {
        setCell(JSON.parse(range.text));
      } catch (error) {
        setCell(undefined);
      }
    }
  }, [range]);

  useEffect(() => {
    if (cell) {
      try {
        Excel.run(async (context) => {
          const range = context.workbook.getSelectedRange();
          range.values = [[JSON.stringify(cell)]];
          range.format.set({ horizontalAlignment: Excel.HorizontalAlignment.fill });
          return context.sync();
        });
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  }, [cell]);

  const clearCell = async () => {
    setCell(undefined);
    try {
      Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.values = [[""]];
        range.format.set({ horizontalAlignment: Excel.HorizontalAlignment.general });
        return context.sync();
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{range?.address}</p>
      {range && range.cellCount === 1 ? (
        <div>
          <div>
            <button
              type="button"
              onClick={() => {
                clearCell();
              }}
            >
              Delete
            </button>
            <label>
              <input
                type="radio"
                value="input"
                checked={cell?.type === "input"}
                onChange={() => {
                  setCell({ ...cell, type: "input" });
                }}
              />
              Input
            </label>
            <label>
              <input
                type="radio"
                value="input"
                checked={cell?.type === "message"}
                onChange={() => {
                  setCell({ ...cell, type: "message" });
                }}
              />
              Message
            </label>
          </div>
          <div>
            {cell?.type === "input" && (
              <InputHandler cell={cell} setCellContent={(cellContent) => setCell({ ...cell, content: cellContent })} />
            )}
          </div>
        </div>
      ) : (
        <div>Select a single cell to manage it&apos;s properties.</div>
      )}
    </div>
  );
};

export default CellHandler;