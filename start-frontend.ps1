$ErrorActionPreference = 'Stop'

$frontendPort = 3000
$frontendPath = Join-Path $PSScriptRoot 'smartcampus-frontend'

$listener = Get-NetTCPConnection -LocalPort $frontendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  Write-Host "Frontend already running on port $frontendPort (PID: $($listener.OwningProcess))."
  exit 0
}

if (-not (Test-Path $frontendPath)) {
  Write-Error "Frontend folder not found: $frontendPath"
  exit 1
}

$packageJson = Join-Path $frontendPath 'package.json'
if (-not (Test-Path $packageJson)) {
  Write-Error "package.json not found in: $frontendPath"
  exit 1
}

Set-Location $frontendPath

Write-Host "Starting frontend from $frontendPath on port $frontendPort..."
npm start
