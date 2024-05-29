import { InputAttributes } from "./InputAttributes";

export interface CustomAttributes {
    type: "input" | "message";
    content?: InputAttributes;
  }