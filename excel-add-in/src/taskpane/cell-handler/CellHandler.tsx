/* global Excel */
//* global setTimeout */
/* global console */

import React, { FC, useEffect, useState } from "react";
import { CellRange } from "../App";
import InputHandler from "./input-handler/InputHandler";
import { Input, Radio, Switch } from "antd";
import { CustomAttributes } from "../types/CustomAttributes";
import { ExportHandler } from "../export/ExportHandler";
import TextArea from "antd/es/input/TextArea";

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
    console.log("Cell:", cell);
    if (cell) {
      if (cell.input !== undefined || cell.tooltip !== undefined) {
        try {
          const newContent = JSON.stringify(cell);
          Excel.run(async (context) => {
            if (range?.address) {
              try {
                const comment = context.workbook.comments.getItemByCell(range.address);
                comment.resolved = false;
                comment.load("content");
                await context.sync();
                if (comment.content === newContent) {
                  console.log("true");
                  comment.resolved = true;
                  await context.sync();
                  return;
                } else {
                  console.log("false");
                  comment.content = newContent;
                  comment.resolved = true;
                  await context.sync();
                  LIVE_SERVER.handleChange();
                }
              } catch (error) {
                console.log("error");
                if (range.address) {
                  const comment = context.workbook.comments.add(range.address, JSON.stringify(newContent));
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
      } else {
        clearCell();
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
      <h1>Manage {range?.address}</h1>

      {range && range?.address ? (
        <div>
          <h2>
            Input&nbsp;
            <Switch
              checked={cell?.input !== undefined}
              onChange={(checked) => setCell({ ...cell, input: checked ? {} : undefined })}
            />
          </h2>
          {cell?.input !== undefined && (
            <InputHandler cell={cell} setCellContent={(cellContent) => setCell({ ...cell, input: cellContent })} />
          )}
          <hr />
          <h2>
            Tooltip&nbsp;
            <Switch
              checked={cell?.tooltip !== undefined}
              onChange={(checked) => setCell({ ...cell, tooltip: checked ? "" : undefined })}
            />
          </h2>
          {cell?.tooltip !== undefined && (
            <TextArea
              style={{ height: 120, resize: "none" }}
              value={cell.tooltip}
              onChange={({ target: { value } }) => setCell({ ...cell, tooltip: value })}
            />
          )}
        </div>
      ) : (
        <div>Select a cell to manage it&apos;s properties.</div>
      )}
    </div>
  );
};

export default CellHandler;
