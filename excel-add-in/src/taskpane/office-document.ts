/* global Excel console */

export const insertText = async (text: string) => {
  // Write text to the top left cell.
  try {
    Excel.run(async (context) => {
      // const sheet = context.workbook.worksheets.getActiveWorksheet();
      // const range = sheet.getRange("A1");
      const range = context.workbook.getSelectedRange();
      range.values = [[text]];
      range.format.autofitColumns();
      return context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

// export const onSelectionChange = async () => {
//   try {
//     Excel.run(async (context) => {
//       context.workbook.onSelectionChanged
//     });
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// };
