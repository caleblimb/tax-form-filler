import { Cell } from "./Cell";

export interface PdfMap {
  fileName: string;
  name: string;
  connections: Cell[];
}
