# Tax Form Filler

This application aims to simplify the process of completing basic tax form for the IRS.

## Run Excel Add-In

- Requirements
  - Windows 10/11
  - Excel 2021+
- Right click on `Start Excel Plugin.ps1` and select `Run with PowerShell`. This will do the following:
  - Check for and install the latest version of node
  - Check for and build the `node_modules`
  - Check for and install local certificate from Microsoft so Excel trusts the Add-In
  - Open Excel
  - Sideload the Add-In
  - Open the Add-In

## Backend

- [README](./backend/README.md)

## Frontend

- [README](./frontend/README.md)

## Excel Add-In

- [README](./excel-add-in/README.md)
