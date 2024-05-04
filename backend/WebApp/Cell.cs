public class Cell
{
    public required string Sheet { get; set; }
    public required int Row { get; set; }
    public required int Col { get; set; }
    public required string Formula { get; set; }
    public required string Value { get; set; }
    public required string Format { get; set; }
    // public required string Text { get; set; }
}