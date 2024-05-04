# Tax Form Filler

This application aims to simplify the process of completing basic tax form for the IRS.

## Run Excel Add-in

- Windows 10, 11
- Excel 2021+
- npm version 10+
- Change directory to `/excel-add-in`
- Run `npm install`
- Run `npm run build`
- VS Code
  - `RUN AND DEBUG` tab
  - Select `Excel Desktop (Edge Chromium)`
  - Run

## Run fronend

- npm version 10+
- Change directory to `/tax-form-filler/frontend`
- Run `npm install`
- Run `npm start`

## Run backend

- Install .NET Core SDK version 8+: https://dotnet.microsoft.com/download/dotnet-core
- `dotnet add package ClosedXML` [https://docs.closedxml.io/en/latest/index.html](Closed XML Documentation)
- Change directory to `/tax-form-filler/backend`
- Run `dotnet run`
- Default Swagger URL: `http://localhost:5291/swagger/index.html`
