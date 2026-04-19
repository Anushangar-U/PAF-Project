$ErrorActionPreference = 'Stop'

$backendScript = Join-Path $PSScriptRoot 'start-backend.ps1'
$frontendScript = Join-Path $PSScriptRoot 'start-frontend.ps1'

if (-not (Test-Path $backendScript)) {
  Write-Error "Backend start script not found: $backendScript"
  exit 1
}

if (-not (Test-Path $frontendScript)) {
  Write-Error "Frontend start script not found: $frontendScript"
  exit 1
}

Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$backendScript`"")
Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', "`"$frontendScript`"")

Write-Host 'Launched backend and frontend startup scripts in separate terminals.'
