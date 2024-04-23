

using DocumentFormat.OpenXml.Office.PowerPoint.Y2021.M06.Main;

class Program
{
    // Spreadsheet doc;
    static void Main(string[] args)
    {

        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddCors(options =>
       {
           options.AddPolicy("AllowSpecificOrigins",
               builder =>
               {
                   builder.WithOrigins("http://localhost:3000/", "https://localhost:3000/")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
               });
       });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(options =>
        {
            options.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });

        // Enable CORS
        app.UseCors("AllowSpecificOrigins");

        app.UseHttpsRedirection();

        addApis(app);

        app.Run();

    }

    private static void addApis(WebApplication app)
    {

        Spreadsheet doc = new Spreadsheet("res/2023 Tax Workbook - 1040 Template.xlsx");
        app.MapGet("/get-document", () =>
        {
            return doc.getWorkbook();
        }).WithName("GetDocument").WithOpenApi();
    }
}

