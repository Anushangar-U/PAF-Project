param(
  [switch]$RestartIfRunning
)

$ErrorActionPreference = 'Stop'

function Test-JavaHome([string]$javaHome) {
  if (-not $javaHome) {
    return $false
  }

  return Test-Path (Join-Path $javaHome 'bin\java.exe')
}

function Get-JavaHomeFromPath {
  $javaCommand = Get-Command java -ErrorAction SilentlyContinue
  if (-not $javaCommand -or -not $javaCommand.Source) {
    return $null
  }

  if (-not (Test-Path $javaCommand.Source)) {
    return $null
  }

  $binPath = Split-Path $javaCommand.Source -Parent
  return Split-Path $binPath -Parent
}

function Resolve-JavaHome {
  $candidates = @()
  $userJdkRoot = Join-Path $env:USERPROFILE '.jdk'

  if ($env:JAVA_HOME) {
    $candidates += $env:JAVA_HOME
  }

  # Preferred project JDK location.
  $candidates += 'C:\Program Files\Java\jdk-21'

  if (Test-Path $userJdkRoot) {
    $userJdk21Folders = Get-ChildItem -Path $userJdkRoot -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue |
      Sort-Object Name -Descending

    foreach ($folder in $userJdk21Folders) {
      $candidates += $folder.FullName
    }
  }

  $javaHomeFromPath = Get-JavaHomeFromPath
  if ($javaHomeFromPath) {
    $candidates += $javaHomeFromPath
  }

  foreach ($basePath in @('C:\Program Files\Java', 'C:\Program Files\Eclipse Adoptium', $userJdkRoot)) {
    if (-not (Test-Path $basePath)) {
      continue
    }

    $jdkFolders = Get-ChildItem -Path $basePath -Directory -Filter 'jdk*' -ErrorAction SilentlyContinue |
      Sort-Object Name -Descending

    foreach ($folder in $jdkFolders) {
      $candidates += $folder.FullName
    }
  }

  foreach ($candidate in $candidates | Select-Object -Unique) {
    if (Test-JavaHome $candidate) {
      return $candidate
    }
  }

  return $null
}

function Get-MajorJavaVersion([string]$javaExePath) {
  try {
    $versionLine = & $javaExePath -version 2>&1 | Select-Object -First 1
    if (-not $versionLine) {
      return $null
    }

    if ($versionLine -notmatch '"([^"]+)"') {
      return $null
    }

    $rawVersion = $Matches[1]
    $major = 0

    if ($rawVersion.StartsWith('1.')) {
      $parts = $rawVersion.Split('.')
      if ($parts.Length -ge 2 -and [int]::TryParse($parts[1], [ref]$major)) {
        return $major
      }

      return $null
    }

    $leadingDigits = ($rawVersion -split '[^0-9]')[0]
    if (-not $leadingDigits) {
      return $null
    }

    if ([int]::TryParse($leadingDigits, [ref]$major)) {
      return $major
    }
  }
  catch {
    return $null
  }

  return $null
}

function Get-RequiredJavaVersion([string]$pomPath) {
  if (-not (Test-Path $pomPath)) {
    return $null
  }

  try {
    [xml]$pomXml = Get-Content -Path $pomPath
    $javaVersionText = $pomXml.project.properties.'java.version'
    if (-not $javaVersionText) {
      return $null
    }

    $leadingDigits = ($javaVersionText.ToString() -split '[^0-9]')[0]
    if (-not $leadingDigits) {
      return $null
    }

    $major = 0
    if ([int]::TryParse($leadingDigits, [ref]$major)) {
      return $major
    }
  }
  catch {
    return $null
  }

  return $null
}

function Wait-PortRelease([int]$port, [int]$timeoutSeconds = 10) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    $busy = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $busy) {
      return $true
    }

    Start-Sleep -Milliseconds 250
  }

  $remaining = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  return -not $remaining
}

$backendPort = 9091
$backendPath = Join-Path $PSScriptRoot 'smartcampus-backend'

$listener = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $existingPid = $listener.OwningProcess
  $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
  $existingName = if ($existingProcess) { $existingProcess.ProcessName } else { 'unknown-process' }

  if (-not $RestartIfRunning) {
    Write-Host "Backend already running on port $backendPort (PID: $existingPid, Process: $existingName)."
    Write-Host 'Use -RestartIfRunning to stop the current listener and start a fresh backend instance.'
    exit 0
  }

  Write-Host "Stopping existing process on port $backendPort (PID: $existingPid, Process: $existingName)..."
  try {
    Stop-Process -Id $existingPid -Force -ErrorAction Stop
  }
  catch {
    Write-Error "Failed to stop process $existingPid on port $backendPort. Run PowerShell as Administrator and try again."
    exit 1
  }

  # Confirm port is free before continuing.
  if (-not (Wait-PortRelease -port $backendPort -timeoutSeconds 10)) {
    $portStillBusy = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    Write-Error "Failed to free port $backendPort. Process $($portStillBusy.OwningProcess) is still listening."
    exit 1
  }

  Write-Host "Port $backendPort is free. Continuing startup..."
}

if (-not (Test-Path $backendPath)) {
  Write-Error "Backend folder not found: $backendPath"
  exit 1
}

Set-Location $backendPath

$resolvedJavaHome = Resolve-JavaHome
if (-not $resolvedJavaHome) {
  Write-Error 'No valid JDK found. Set JAVA_HOME to a JDK folder that contains bin\java.exe (for example: C:\Program Files\Java\jdk-21).'
  exit 1
}

$env:JAVA_HOME = $resolvedJavaHome

if ($env:Path -notlike "*$env:JAVA_HOME\bin*") {
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

$javaExePath = Join-Path $env:JAVA_HOME 'bin\java.exe'
$detectedJavaMajor = Get-MajorJavaVersion $javaExePath
$requiredJavaMajor = Get-RequiredJavaVersion (Join-Path $backendPath 'pom.xml')

if ($requiredJavaMajor -and $detectedJavaMajor -and $detectedJavaMajor -lt $requiredJavaMajor) {
  Write-Error "Detected Java $detectedJavaMajor at '$env:JAVA_HOME', but this project requires Java $requiredJavaMajor (pom.xml)."
  exit 1
}

Write-Host "Using JAVA_HOME=$env:JAVA_HOME"
if ($detectedJavaMajor) {
  Write-Host "Detected Java major version: $detectedJavaMajor"
}

Write-Host "Starting backend from $backendPath on port $backendPort..."
& .\mvnw.cmd spring-boot:run
