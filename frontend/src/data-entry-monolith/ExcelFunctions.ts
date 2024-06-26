export const SUM = (...values: any[]) => {
  return values.reduce((total, current) => total + +current, 0);
};

export const NOT = (expression: any) => {
  return !expression;
};

export const IF = (expression: any, ifTrue: any, ifFalse: any) => {
  return expression ? ifTrue : ifFalse;
};

export const RIGHT = (value: string) => {
  if (value.length <= 2) return value;
  return value.substring(value.length - 2);
};

export const TEXT = (...values: any[]) => {
  return values.reduce((total, current) => total + current.toString(), "");
};

export const FILTER = (values: any[], condition: any, if_empty?: any) => {
  const results = values.filter((item) => {
    return condition;
  });
  return if_empty;
};

export const INDEX = (values: any[], rowIndex: number, colIndex?: number) => {
  if (rowIndex > values.length) {
    return "";
  }

  const row = values[rowIndex - 1];

  if (colIndex === undefined || colIndex > row.length) {
    return row;
  }

  return row[colIndex - 1];
};
