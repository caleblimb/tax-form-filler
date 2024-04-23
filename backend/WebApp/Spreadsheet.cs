using ClosedXML.Excel;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Drawing.Charts;

public class Spreadsheet
{
    // IXLWorksheet worksheet;

    readonly string[] worksheetNames;
    readonly Sheet[] sheets;

    public Spreadsheet(string filePath)
    {
        using XLWorkbook workbook = new XLWorkbook(filePath);

        var worksheetCount = workbook.Worksheets.Count;
        worksheetNames = new string[worksheetCount];

        sheets = new Sheet[worksheetCount];

        for (int i = 0; i < worksheetCount; i++)
        {
            var worksheet = workbook.Worksheets.ElementAt(i);

            worksheetNames[i] = worksheet.Name;

            var columnsUsed = worksheet.ColumnsUsed();
            var rowsUsed = worksheet.RowsUsed();

            var sheet = new Sheet
            {
                name = worksheet.Name,
                width = columnsUsed.Count(),
                height = rowsUsed.Count()
            };

            sheets[i] = sheet;


            // sheets[i].name = worksheet.Name;
            // sheets[i].width = columnsUsed.Count();
            // sheets[i].height = rowsUsed.Count();

        }

    }

    public string[] getWorksheet()
    {
        return this.worksheetNames;
    }

    public Sheet[] getWorkbook()
    {
        Console.Write(this.sheets);
        return this.sheets;
    }
}

