/* global Excel */
//* global setTimeout */
/* global console */

import React, { FC, useEffect, useState } from "react";
import { CellRange } from "../App";
import InputHandler from "./input-handler/InputHandler";
import { Radio } from "antd";
import { CustomAttributes } from "../types/CustomAttributes";
import { ExportHandler } from "../export/ExportHandler";

interface InputHandlerProps {
  range: CellRange | undefined;
  LIVE_SERVER: ExportHandler;
}

const CellHandler: FC<InputHandlerProps> = ({ range, LIVE_SERVER }: InputHandlerProps) => {
  const [cell, setCell] = useState<CustomAttributes>();
  useEffect(() => {
    if (range && range.cellCount === 1) {
      try {
        setCell(JSON.parse(range.commentData!));
      } catch (error) {
        setCell(undefined);
      }
    }
  }, [range]);

  useEffect(() => {
    if (cell) {
      try {
        Excel.run(async (context) => {
          if (range?.address) {
            try {
              const comment = context.workbook.comments.getItemByCell(range.address);
              comment.resolved = false;
              comment.content = JSON.stringify(cell);
              comment.resolved = true;
              await context.sync();
              LIVE_SERVER.handleChange();
            } catch (error) {
              if (range.address) {
                const comment = context.workbook.comments.add(range.address, JSON.stringify(cell));
                comment.resolved = true;
                await context.sync();
                LIVE_SERVER.handleChange();
              }
            }
          }
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
        if (range) {
          const selectedRange = context.workbook.getSelectedRange();
          const comment = context.workbook.comments.getItemByCell(range.address);
          comment.delete();
          selectedRange.format.set({ horizontalAlignment: Excel.HorizontalAlignment.general });
          await context.sync();
          LIVE_SERVER.handleChange();
        }
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <div>
      <h1>Manage Cell</h1>

      {range && range?.address ? (
        <div>
          <div>
            <Radio.Group
              options={[
                { label: "None", value: "" },
                { label: "Input", value: "input" },
                { label: "Message", value: "message" },
              ]}
              onChange={({ target: { value } }) => {
                if (value) {
                  setCell({ type: value });
                } else {
                  clearCell();
                }
              }}
              value={cell?.type}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <hr />
          <div>
            {cell?.type === "input" && (
              <InputHandler cell={cell} setCellContent={(cellContent) => setCell({ ...cell, content: cellContent })} />
            )}
          </div>
        </div>
      ) : (
        <div>Select a cell to manage it&apos;s properties.</div>
      )}
    </div>
  );
};

export default CellHandler;
