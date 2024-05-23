import { InputType } from "./InputType";

export interface InputCell {
    type?: InputType;
    min?: number;
    max?: number;
    formatAsCurrency?: boolean;
    options?: string[];
}