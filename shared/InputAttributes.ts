export interface InputAttributes {
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  min?: number;
  max?: number;
  formatAsCurrency?: boolean;
  options?: string[];
}
