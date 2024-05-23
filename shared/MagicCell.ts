import { InputCell } from "./InputCell";

export interface MagicCell {
    type: "input" | "message";
    content?: InputCell;
  }