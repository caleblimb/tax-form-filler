import { Cell } from "../types/Cell";
import { SheetPage } from "../types/SheetPage";
import { StringBuilder } from "./ExportUtilities";

const getExcelDataType = (value: string | number | Date): "string" | "number" | "Date" | "boolean" => {
  if (typeof value === "boolean") {
    return "boolean";
  }

  if (typeof value === "number" && !isNaN(value)) {
    return "number";
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    return "Date";
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
      return "boolean";
    }

    const numberValue = parseFloat(value);
    if (!isNaN(numberValue) && isFinite(numberValue)) {
      return "number";
    }
  }

  return "string";
};

const declareConstant = (cell: Cell): string => {
  let valueType: string = "any";
  let valueDefault: string = "";
  if (cell.attributes?.type === "input" || cell.formula) {
    if (cell.attributes?.type === "input") {
      switch (cell.attributes.content?.type) {
        case "number":
          valueType = "number";
          valueDefault = "0";
          break;
        case "text":
        case "dropdown":
        case "radio":
        default:
          valueType = "string";
          valueDefault = "";
          break;
        case "date":
          valueType = "Date";
          valueDefault = "new Date()";
          break;
      }
    }
    return `const [${cell.get}, ${cell.set}] = useState<${valueType}>(${valueDefault});\n`;
  } else {
    valueType = getExcelDataType(cell.value as string);
    return `const ${cell.get}:${valueType} = ${valueType === "string" ? `"${cell.value}"` : `${cell.value}`};\n`;
  }
};

const parseFormula = (cell: Cell): string => {
  if (!cell.formula) {
    throw new Error("Error trying to parse a cell without a formula: " + cell);
  }
  const dependencies: string[] = [];

  const parsedFormula = cell.formula.replace(/'[A-Za-z\d]+'![A-Z]+\d+/g, (match) => {
    const cellName = `get_${match.replace(/'/g, "").replace("!", "_")}`;
    dependencies.push(cellName);
    return cellName;
  });

  return `useEffect(() => {\n` + `${cell.set}(${parsedFormula});\n` + `}, [${dependencies.join(", ")}]);\n`;
};

const buildCell = (cell: Cell): string => {
  if (cell.attributes) {
    if (cell.attributes.type === "input") {
      switch (cell.attributes.content?.type) {
        case "text":
          return `<Input type="text" onChange={(e) => ${cell.set}(e.target.value)} />`;
        case "number":
          return cell.attributes.content.formatAsCurrency
            ? `<InputNumber<number>
                formatter={(value) => \`$ \${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}
                parser={(value) => value?.replace(/\\$\\s?|(,*)/g, "") as unknown as number}
                onChange={(e) => ${cell.set}(e ?? 0)}
              />`
            : `<Input
                type="number"
                min={${cell.attributes.content.min}}
                max={${cell.attributes.content.max}}
                onChange={(e) => ${cell.set}(+e.target.value)}
              />`;
        case "date":
          return `<DatePicker />`;
        case "dropdown":
          return (
            `<Select
            style={{ minWidth: "10rem" }}
            allowClear
            options={[` +
            cell.attributes.content.options
              ?.map((option) => {
                return `{ value: "${option}", label: "${option}" }`;
              })
              .join(",") +
            `]}
            onChange={(value) => ${cell.set}(value)}
            />`
          );
        case "radio":
          return (
            `<Radio.Group
                    options={[` +
            cell.attributes.content.options
              ?.map((option) => {
                return `{ value: "${option}", label: "${option}" }`;
              })
              .join(",") +
            `]}
                    onChange={(e) => ${cell.set}(e.target.value)}
                  />`
          );
      }
    } else {
      return cell.value;
    }
  } else if (cell.formula) {
    return `{ ${cell.get} }`;
  } else {
    return cell.value;
  }

  return "";
};

export const generateTypescript = (sheets: SheetPage[]): string => {
  const stringBuilder = new StringBuilder();
  stringBuilder.append(
    `
  // *********************************************************************
  // * IMPORANT: This file was generated, do not try to modify directly! *
  // *********************************************************************
  import { FC, useState, useEffect } from "react";
  import { DatePicker, Input, InputNumber, Radio, Select, Divider, Steps } from "antd";
  
  const SUM = (...values: any[]) => {
    return values.reduce((total, current) => total + +current, 0);
  };
  
  const NOT = (expression: any) => {
    return !expression;
  };

  const IF = (expression: any, ifTrue: any, ifFalse: any) => {
    return (expression) ? (ifTrue) : (ifFalse);
  };

  type DataEntryMonolithProps = {
  p?: any;
  };

  const DataEntryMonolith: FC<DataEntryMonolithProps> = ({
  p,
  }: DataEntryMonolithProps) => {`
  );

  sheets.forEach((sheet) => {
    sheet.cells.forEach((row) => {
      row.forEach((cell) => {
        stringBuilder.append(declareConstant(cell));
      });
    });
  });

  sheets.forEach((sheet) => {
    sheet.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.formula) {
          stringBuilder.append(parseFormula(cell));
        }
      });
    });
  });

  stringBuilder.append(`
    const [currentSheet, setCurrentSheet] = useState<number>(0);
    const onSheetChange = (value: number) => {
      setCurrentSheet(value);
    };\n`);

  stringBuilder.append(`
  return (
    <div className="data-entry-mololith">\n`);

  stringBuilder.append(`
  <Steps
    current={currentSheet}
    onChange={onSheetChange}
    items={[\n`);
  sheets.forEach((sheet) => {
    stringBuilder.append(`{title: "${sheet.name}"},\n`);
  });
  stringBuilder.append(`
    {title: "Exports"},
    ]}
  />
  <Divider />\n`);

  sheets.forEach((sheet, index: number) => {
    stringBuilder.append(`{currentSheet === ${index} && (<div><table><tbody>\n`);
    sheet.cells.forEach((row) => {
      stringBuilder.append(`<tr>\n`);
      row.forEach((cell) => {
        stringBuilder.append(`<td colSpan={${cell.colSpan}} rowSpan={${cell.rowSpan}}>\n`);
        stringBuilder.append(buildCell(cell));
        stringBuilder.append(`</td>\n`);
      });
      stringBuilder.append(`</tr>\n`);
    });
    stringBuilder.append(`</tbody></table></div>)}\n`);
  });

  stringBuilder.append(`
    {currentSheet === ${sheets.length} && (
    <div><h1>PDF Exports</h1>\n`);
  stringBuilder.append(`</div>)}\n`);

  stringBuilder.append(`
      </div> //data-entry-monolith
    );
  };
  
  export default DataEntryMonolith;
  `);

  return stringBuilder.toString();
};
