Param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceAccountPath,

    [Parameter(Mandatory=$false)]
    [string]$EnvFilePath = ".env",

    [switch]$UpdateEnv
)

if (-not (Test-Path $ServiceAccountPath)) {
    Write-Error "Service account file not found: $ServiceAccountPath"
    exit 1
}

$sa = Get-Content $ServiceAccountPath -Raw
$encoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($sa))
Write-Output $encoded

if ($UpdateEnv) {
    if (-not (Test-Path $EnvFilePath)) {
        Write-Error ".env file not found: $EnvFilePath"
        exit 1
    }

    $envContent = Get-Content $EnvFilePath -Raw
    if ($envContent -match "^NUXT_FIREBASE_ADMIN_SA=.*$") {
        $envContent = [System.Text.RegularExpressions.Regex]::Replace($envContent, "^NUXT_FIREBASE_ADMIN_SA=.*$", "NUXT_FIREBASE_ADMIN_SA=$encoded", 'Multiline')
    } else {
        $envContent = $envContent.TrimEnd() + "`nNUXT_FIREBASE_ADMIN_SA=$encoded`n"
    }

    Set-Content -Path $EnvFilePath -Value $envContent -NoNewline
    Write-Output "Updated $EnvFilePath with NUXT_FIREBASE_ADMIN_SA"
}
