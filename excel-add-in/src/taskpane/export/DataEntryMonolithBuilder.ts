import { Cell } from "../types/Cell";
import { PdfMap } from "../types/PdfMap";
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

    // const numberValue = parseFloat(value);
    // if (!isNaN(numberValue) && isFinite(numberValue)) {
    //   return "number";
    // }
  }

  return "string";
};

const declareConstant = (cell: Cell): string => {
  let valueType: string = "any";
  let valueDefault: string = "";
  if (cell.attributes?.input) {
    switch (cell.attributes.input?.type) {
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
};

const parseFormula = (cell: Cell, constants: Map<string, string>): string => {
  if (!cell.formula) {
    throw new Error("Error trying to parse a cell without a formula: " + cell);
  }
  const dependencies: string[] = [];

  const parsedFormula = cell.formula.replace(/'[A-Za-z\d]+'![A-Z]+\d+/g, (match) => {
    const cellName = `get_${match.replace(/'/g, "").replace("!", "_")}`;
    if (constants.has(cellName)) {
      const value = constants.get(cellName)!;
      if (value.toString().replace(/\s/g, "").length > 0) {
        return cellName.replace(cellName, `"${constants.get(cellName)!}"`);
      } else {
        return cellName.replace(cellName, `""`);
      }
    }
    dependencies.push(cellName);
    return cellName;
  });

  return `useEffect(() => {\n` + `${cell.set}(${parsedFormula});\n` + `}, [${dependencies.join(", ")}]);\n`;
};

const buildCell = (cell: Cell): string => {
  if (cell.attributes) {
    if (cell.attributes.input) {
      switch (cell.attributes.input?.type) {
        case "text":
          return `<Input type="text" onChange={(e) => ${cell.set}(e.target.value)} />`;
        case "number":
          return cell.attributes.input.formatAsCurrency
            ? `<InputNumber<number>
                formatter={(value) => \`$ \${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}
                parser={(value) => value?.replace(/\\$\\s?|(,*)/g, "") as unknown as number}
                onChange={(e) => ${cell.set}(e ?? 0)}
              />`
            : `<Input
                type="number"
                min={${cell.attributes.input.min}}
                max={${cell.attributes.input.max}}
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
            cell.attributes.input.options
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
            cell.attributes.input.options
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

export const generateTypescript = (sheets: SheetPage[], pdfs: PdfMap[]): string => {
  const stringBuilder = new StringBuilder();
  stringBuilder.append(
    `
  // *********************************************************************
  // * IMPORANT: This file was generated, do not try to modify directly! *
  // *********************************************************************
  import { FC, useState, useEffect } from "react";
  import { DatePicker, Input, InputNumber, Radio, Select, Divider, Steps, Space, Tooltip } from "antd";
  import { SUM, NOT, IF, RIGHT, TEXT } from "./ExcelFunctions";
  import PdfExport from "../components/PdfExport";

  type DataEntryMonolithProps = {
  p?: any;
  };

  const DataEntryMonolith: FC<DataEntryMonolithProps> = ({
  p,
  }: DataEntryMonolithProps) => {`
  );

  const constants = new Map<string, string>();
  sheets.forEach((sheet) => {
    sheet.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.attributes?.input || cell.formula) {
          stringBuilder.append(declareConstant(cell));
        } else {
          const valueType = getExcelDataType(cell.value as string);
          if (valueType === "string") {
            constants.set(cell.get, cell.value.replace(/\n/g, "\\n").replace(/"/g, '\\"'));
          } else {
            constants.set(cell.get, cell.value);
          }
        }
      });
    });
  });

  pdfs.forEach((pdf) => {
    pdf.connections.forEach((cell) => {
      if (cell.formula) {
        stringBuilder.append(declareConstant(cell));
      } else if (cell.value) {
        const valueType = getExcelDataType(cell.value as string);
        if (valueType === "string") {
          constants.set(cell.get, cell.value.replace(/\n/g, "\\n").replace(/"/g, '\\"'));
        } else {
          constants.set(cell.get, cell.value);
        }
      } else {
        constants.set(cell.get, ``);
      }
    });
  });

  sheets.forEach((sheet) => {
    sheet.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.formula) {
          stringBuilder.append(parseFormula(cell, constants));
        }
      });
    });
  });

  pdfs.forEach((pdf) => {
    pdf.connections.forEach((cell) => {
      if (cell.formula) {
        stringBuilder.append(parseFormula(cell, constants));
      }
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
      stringBuilder.append(`<tr>`);
      row.forEach((cell) => {
        stringBuilder.append(`<td`);
        if (cell.colSpan !== 1) {
          stringBuilder.append(` colSpan={${cell.colSpan}}`);
        }
        if (cell.rowSpan !== 1) {
          stringBuilder.append(` rowSpan={${cell.rowSpan}}`);
        }
        if (cell.style.length > 3) {
          stringBuilder.append(` style={${cell.style}}`);
        }
        stringBuilder.append(`>`);

        if (cell.attributes?.tooltip && cell.attributes?.tooltip?.length > 0) {
          stringBuilder.append(`<Tooltip title="${cell.attributes.tooltip}">`);
        }

        stringBuilder.append(buildCell(cell));

        if (cell.attributes?.tooltip && cell.attributes?.tooltip?.length > 0) {
          stringBuilder.append(`</Tooltip>`);
        }

        stringBuilder.append(`</td>`);
      });
      stringBuilder.append(`</tr>\n`);
    });
    stringBuilder.append(`</tbody></table></div>)}\n`);
  });

  stringBuilder.append(`
    {currentSheet === ${sheets.length} && (
    <div><h1>PDF Exports</h1>\n`);

  stringBuilder.append(`<Space direction="horizontal" size={16}>\n`);
  pdfs.forEach((pdf: PdfMap) => {
    const formData = pdf.connections
      .map((cell) => (constants.has(cell.get) ? `"${constants.get(cell.get)}"` : cell.get))
      .join(",");
    stringBuilder.append(
      `<PdfExport fileName={"${pdf.fileName}"} cardName={"${pdf.name}"} formData={[${formData}]} />\n`
    );
  });
  stringBuilder.append(`</Space>`);

  stringBuilder.append(`</div>)}\n`);

  stringBuilder.append(`
      </div> //data-entry-monolith
    );
  };
  
  export default DataEntryMonolith;
  `);

  return stringBuilder.toString();
};
