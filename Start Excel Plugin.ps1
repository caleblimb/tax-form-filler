# Check if npm is installed
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue

if (-not $npmInstalled) {
    Write-Output "npm is not installed. Installing npm..."
    Invoke-WebRequest -Uri https://nodejs.org/dist/latest/node-v16.13.0-x64.msi -OutFile nodejs.msi
    Start-Process msiexec.exe -ArgumentList "/i nodejs.msi /quiet" -Wait
    Remove-Item -Force nodejs.msi
    $env:Path += ";$env:ProgramFiles\nodejs"
    Write-Output "npm installed successfully."
} else {
    Write-Output "npm is already installed."
}

# Set the relative directory path
$relativeDir = ".\excel-add-in"

# Check if the 'node_modules' folder exists
if (-Not (Test-Path "$relativeDir\node_modules")) {
    Write-Output "node_modules folder not found. Running npm install..."
    Push-Location $relativeDir
    npm install
    Pop-Location
} else {
    Write-Output "node_modules folder already exists."
}

# Run 'npm start' in the relative directory
Write-Output "Running npm start..."
Push-Location $relativeDir
npm start
Pop-Location