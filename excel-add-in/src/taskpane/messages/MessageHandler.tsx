import React, { FC } from "react";

interface MessageHandlerProps {
  title: string;
}

const MessageHandler: FC<MessageHandlerProps> = ({ title }: MessageHandlerProps) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default MessageHandler;
