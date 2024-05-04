using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Linq;

public class Sheet
{
    public required string Name { get; set; }
    public required int Width { get; set; }
    public required int Height { get; set; }
    public required Cell[,] Cells { get; set; }

}