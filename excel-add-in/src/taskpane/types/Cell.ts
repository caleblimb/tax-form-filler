import { CustomAttributes } from "./CustomAttributes";

export interface Cell {
  key: string;
  value: string;
  attributes: CustomAttributes;
  formula?: string;
  set: string;
  get: string;
  rowSpan: number;
  colSpan: number;
  style: string;
}
