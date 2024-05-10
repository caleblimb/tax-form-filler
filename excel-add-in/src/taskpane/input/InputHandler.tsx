import React, { FC } from "react";

interface InputHandlerProps {
  title: string;
}

const InputHandler: FC<InputHandlerProps> = ({ title }: InputHandlerProps) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default InputHandler;
