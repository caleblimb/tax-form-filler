# Check if npm is installed
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue

if (-not $npmInstalled) {
    Write-Output "npm is not installed. Installing npm..."
    
    # installs fnm (Fast Node Manager)
    $fnmInstalled = Get-Command fnm -ErrorAction SilentlyContinue
    if (-not $fnmInstalled) {
        Write-Output "fnm is not installed. Installing fnm..."
        winget install Schniz.fnm
        Write-Output "fnm installed correctly."
    }
    
    # download and install Node.js
    fnm env --use-on-cd | Out-String | Invoke-Expression
    fnm use --install-if-missing 20
    
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