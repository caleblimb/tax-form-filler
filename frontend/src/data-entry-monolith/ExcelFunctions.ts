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
