# Check if npm is installed
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue

if (-not $npmInstalled) {
    Write-Output "npm is not installed. Installing npm..."
    Invoke-WebRequest -Uri https://nodejs.org/dist/latest/node-v16.13.0-x64.msi -OutFile nodejs.msi
    Start-Process msiexec.exe -ArgumentList "/i nodejs.msi /quiet" -Wait
    Remove-Item -Force nodejs.msi
    $env:Path += ";$env:ProgramFiles\nodejs"
    Write-Output "npm installed successfully."
}
else {
    Write-Output "npm is already installed."
}

# Set the relative directory path
$addInDir = ".\excel-add-in"
$frontendDir = ".\frontend"

# Function to check and install npm dependencies
function Check-And-Install-Dependencies {
    param (
        [string]$dir
    )

    if (-Not (Test-Path "$dir\node_modules")) {
        Write-Output "node_modules folder not found in $dir. Running npm install..."
        Push-Location $dir
        npm install
        Pop-Location
    }
    else {
        Write-Output "node_modules folder already exists in $dir."
    }
}

# Check and install npm dependencies for both directories
Check-And-Install-Dependencies -dir $addInDir
Check-And-Install-Dependencies -dir $frontendDir

# Run 'npm start' in both directories simultaneously
Write-Output "Running npm start in $addInDir and $frontendDir..."

Start-Process powershell -ArgumentList "cd $addInDir; npm start"
Start-Process powershell -ArgumentList "cd $frontendDir; npm run startWindows"
Start-Process powershell -ArgumentList "cd $frontendDir; node live-update-server.js"