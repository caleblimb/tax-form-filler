export interface InputAttributes {
  required?: boolean;
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  min?: number;
  max?: number;
  formatAsCurrency?: boolean;
  options?: string[];
}
