/* global btoa */

export const nextExcelColumnCode = (column: string): string => {
  const n: number = column.length;
  const charCodeA: number = "A".charCodeAt(0);
  const charCodeZ: number = "Z".charCodeAt(0);

  let carry: number = 1; // Start with a carry to increment the column
  let nextColumn: string = "";

  for (let i: number = n - 1; i >= 0; i--) {
    let currentChar: number = column.charCodeAt(i);

    // Add carry to the current character
    let newChar: number = currentChar + carry;
    if (newChar > charCodeZ) {
      newChar = charCodeA;
      carry = 1; // Carry over to the next significant digit
    } else {
      carry = 0; // No carry over needed
    }

    nextColumn = String.fromCharCode(newChar) + nextColumn;
  }

  // If there is still a carry after processing all characters, add a new 'A' at the front
  if (carry === 1) {
    nextColumn = "A" + nextColumn;
  }

  return nextColumn;
};

export const unfoldFormula = (sheetName: string, sheetNames: string[], formula: string): string => {
  let result = formula;

  // Remove double single quotes from sheet names
  result = result.replace(/('')/g, "'");

  // Encode sheet names to avoid parsing errors with symbols
  sheetNames.forEach((name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`[']{0,1}(${escapedName})[']{0,1}!`, "g"), "'" + encodeSheetName(name) + "'!");
  });

  // Add missing sheet names
  result = result.replace(/[^A-Za-z\d!:'][A-Z]+\d+/g, (match) => {
    return match.substring(0, 1) + "'" + encodeSheetName(sheetName) + "'!" + match.substring(1);
  });

  // Unfold Cell Ranges
  result = result.replace(/'[A-Za-z\d]+'![A-Z]+\d+:[A-Z]+\d+/g, (match) => {
    const [namePortion, cellPortion] = match.split("!");
    const [startCell, endCell] = cellPortion.split(":");
    const startCol: string = startCell.match(/[A-Z]+/)![0];
    const startRow: number = +startCell.match(/\d+/)![0];
    const endCol: string = endCell.match(/[A-Z]+/)![0];
    const endRow: number = +endCell.match(/\d+/)![0];

    const cellList: string[] = [];

    for (let row: number = startRow; row <= endRow; row++) {
      for (let col: string = startCol; col != nextExcelColumnCode(endCol); col = nextExcelColumnCode(col)) {
        cellList.push(namePortion + "!" + col + row);
      }
    }

    return cellList.join(",");
  });

  // Remove leading '='
  result = result.replace(/^=/, "");

  // Convert excel comparison to js comparison
  result = result.replace(/=/g, "===");

  return result;
};

export const encodeSheetName = (name: string) => {
  return btoa(name).replace(/[=+/]/g, "");
};

export class StringBuilder {
  private parts: string[];

  constructor() {
    this.parts = [];
  }

  append(text: string): void {
    this.parts.push(text);
  }

  toString(): string {
    return this.parts.join("");
  }
}
