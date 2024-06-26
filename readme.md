# Tax Form Filler

This application aims to simplify the process of completing basic tax form for the IRS.

## Run Application

- Requirements
  - Windows 10/11
  - Excel 2021+
- Run `Start.bat`. This will run `LaunchEnvironment.ps1` in `PowerShell` which will in turn do the following:
  - Verify dependencies
    - Check for and install the latest version of node and npm
    - Check for and build the `node_modules` in `excel-add-in` and `frontend`
    - Check for and install local certificate from Microsoft so Excel trusts the Add-In
  - Open Excel
    - Sideload the Add-In
    - Open the Add-In
  - Open Web Page View
  - Start server for Live updates


### Common issues
  - `Something is already running on port 300X.`
    - The application is designed to use the following ports:
      - `3000`: Excel Add-In
      - `3001`: Live Update Server
      - `3002`: Frontend
  - Excel Add-In fails to fully load
    - Reinstall Security Certificate
      - Delete old certificate
        - Press `Windows + r` on your keyboard
        - Type `certmgr.msc` and press enter
        - Delete the Developer Security Certificate. Be careful when making changes with the certificate manager. The correct certificate is probably located under `Trusted Root Certification Authorities` -> `Certificates` and has the following meta data:
          - Issued To `Developer CA for Microsoft Office Add-ins`
          - Issued By `Developer CA for Microsoft Office Add-ins`
          - Expiration Date will be 1 month after you last installed the certificate
          - Intended Purposes `<All>`
          - Friendly Name `<None>`
      - Reinstall Certificate by running the Excel Add-In loader again

## Backend

- [README](./backend/README.md)

## Frontend, Live Update Server

- [README](./frontend/README.md)

## Excel Add-In

- [README](./excel-add-in/README.md)
