/* global Excel */
/* global console */
import React, { FC, useEffect, useState } from "react";

interface InputHandlerProps {
  title: string;
  range: Excel.Range | undefined;
}

const InputHandler: FC<InputHandlerProps> = ({ title, range }: InputHandlerProps) => {
  const [selectedRange, setSelectedRange] = useState<string>("h");
  useEffect(() => {
    console.log("selection change");
    if (range) {
      Excel.run(async (context) => {
        range.load("address");
        await context.sync();
        setSelectedRange(range.address);
      });
    }
  }, [range]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{selectedRange}</p>
    </div>
  );
};

export default InputHandler;
