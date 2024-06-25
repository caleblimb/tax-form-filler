# Tax Form Filler

This application aims to simplify the process of completing basic tax form for the IRS.

## Run Application

- Requirements
  - Windows 10/11
  - Excel 2021+
- Node
  - [Install Chocolatey](https://chocolatey.org/install) by running `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))` in PowerShell as admin
  - [Install nvm](https://community.chocolatey.org/packages/nvm) by running `choco install nvm` in PowerShell as admin
  - Install node `nvm install 19.5.0`. `22` will not work.
  - Use node `nvm use 19.5.0`
- Right click on `StartDevelopment.ps1` and select `Run with PowerShell`. This will do the following:
  - Verify dependencies
    - Check for and install the latest version of node
    - Check for and build the `node_modules` in `excel-add-in` and `frontend`
    - Check for and install local certificate from Microsoft so Excel trusts the Add-In
  - Open Excel
    - Sideload the Add-In
    - Open the Add-In
  - Open Web Page View
  - Start server for Live updates

## Backend

- [README](./backend/README.md)

## Frontend

- [README](./frontend/README.md)

## Excel Add-In

- [README](./excel-add-in/README.md)
