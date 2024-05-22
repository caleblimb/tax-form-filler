using ClosedXML.Excel;

public class Spreadsheet
{
    // readonly string[] worksheetNames;
    readonly Sheet[] sheets;

    public Spreadsheet(string filePath)
    {
        using XLWorkbook workbook = new XLWorkbook(filePath);

        Console.Write("Creating document");

        var worksheetCount = workbook.Worksheets.Count;
        // worksheetNames = new string[worksheetCount];

        sheets = new Sheet[worksheetCount];

        for (int i = 0; i < worksheetCount; i++)
        {
            var worksheet = workbook.Worksheets.ElementAt(i);
            // worksheetNames[i] = worksheet.Name;
            sheets[i] = ParseSheet(worksheet);
        }

    }


    private static Sheet ParseSheet(IXLWorksheet worksheet)
    {
        var rows = worksheet.Rows();
        var columns = worksheet.Columns();

        var width = columns.Count();
        var height = rows.Count();

        var cells = new Cell[height, width];

        for (int j = 0; j < height; j++)
        {
            var row = rows.ElementAt(j).Cells();

            for (int k = 0; k < width; k++)
            {
                var cell = row.ElementAtOrDefault(k);
                if (cell != null)
                {
                    if (cell.HasComment)
                    {
                        var c = cell.GetComment();
                        Console.WriteLine(c);
                    }

                    cells[j, k] = new Cell
                    {
                        Sheet = worksheet.Name,
                        Col = j,
                        Row = k,
                        Formula = cell.FormulaR1C1,
                        Value = cell.GetValue<string>(),
                        Format = cell.Style.NumberFormat.Format == "General" ? "" : cell.Style.NumberFormat.Format,
                        Attributes = "",
                    };
                }
                else
                {
                    cells[j, k] = new Cell
                    {
                        Sheet = worksheet.Name,
                        Col = j,
                        Row = k,
                        Formula = "",
                        Value = "",
                        Format = "",
                        Attributes = "",
                    };
                }
            }
        }

        var sheet = new Sheet
        {
            Name = worksheet.Name,
            Width = width,
            Height = height,
            Cells = cells
        };

        return sheet;
    }

    public Sheet[] getWorkbook()
    {
        return this.sheets;
    }
}

