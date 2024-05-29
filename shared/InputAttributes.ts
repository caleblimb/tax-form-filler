import { InputType } from "./InputType";

export interface InputAttributes {
    type?: InputType;
    min?: number;
    max?: number;
    formatAsCurrency?: boolean;
    options?: string[];
}