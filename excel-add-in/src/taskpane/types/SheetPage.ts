import { Cell } from "./Cell";

export interface SheetPage {
  name: string;
  cells: Cell[][];
}
