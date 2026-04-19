$ErrorActionPreference = 'Stop'

$backendPort = 9091
$backendPath = Join-Path $PSScriptRoot 'smartcampus-backend'

$listener = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  Write-Host "Backend already running on port $backendPort (PID: $($listener.OwningProcess))."
  exit 0
}

if (-not (Test-Path $backendPath)) {
  Write-Error "Backend folder not found: $backendPath"
  exit 1
}

Set-Location $backendPath

$env:JAVA_HOME = 'C:\Program Files\Java\jdk-25'
if (-not (Test-Path $env:JAVA_HOME)) {
  Write-Error "JAVA_HOME path not found: $env:JAVA_HOME"
  exit 1
}

if ($env:Path -notlike "*$env:JAVA_HOME\bin*") {
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

Write-Host "Starting backend from $backendPath on port $backendPort..."
& .\mvnw.cmd spring-boot:run
