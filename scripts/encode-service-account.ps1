<#
.SYNOPSIS
    Script para codificar um arquivo de conta de serviço do Firebase em base64 e opcionalmente atualizar um arquivo .env.

.DESCRIPTION
    Este script lê o conteúdo de um arquivo de conta de serviço do Firebase, o codifica em base64 e imprime o resultado.
    Opcionalmente, pode atualizar ou adicionar a variável NUXT_FIREBASE_ADMIN_SA em um arquivo .env especificado.

.PARAMETER ServiceAccountPath
    Caminho para o arquivo de conta de serviço do Firebase (obrigatório).

.PARAMETER EnvFilePath
    Caminho para o arquivo .env a ser atualizado (opcional, padrão: ".env").

.PARAMETER UpdateEnv
    Switch para indicar se o arquivo .env deve ser atualizado com a variável codificada.

.EXAMPLE
    .\encode-service-account.ps1 -ServiceAccountPath "path\to\service-account.json"

    Codifica o arquivo e imprime o base64.

.EXAMPLE
    .\encode-service-account.ps1 -ServiceAccountPath "path\to\service-account.json" -UpdateEnv

    Codifica o arquivo, imprime o base64 e atualiza o .env padrão.

.EXAMPLE
    .\encode-service-account.ps1 -ServiceAccountPath "path\to\service-account.json" -EnvFilePath "custom.env" -UpdateEnv

    Codifica o arquivo, imprime o base64 e atualiza um arquivo .env personalizado.
#>

Param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceAccountPath,

    [Parameter(Mandatory=$false)]
    [string]$EnvFilePath = ".env",

    [switch]$UpdateEnv
)

# Verifica se o arquivo de conta de serviço existe
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Error "Service account file not found: $ServiceAccountPath"
    exit 1
}

# Lê o conteúdo do arquivo de conta de serviço e o codifica em base64
$sa = Get-Content $ServiceAccountPath -Raw
$encoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($sa))
Write-Output $encoded

# Se o switch UpdateEnv for usado, atualiza o arquivo .env
if ($UpdateEnv) {
    # Verifica se o arquivo .env existe
    if (-not (Test-Path $EnvFilePath)) {
        Write-Error ".env file not found: $EnvFilePath"
        exit 1
    }

    # Lê o conteúdo do arquivo .env
    $envContent = Get-Content $EnvFilePath -Raw
    # Substitui ou adiciona a variável NUXT_FIREBASE_ADMIN_SA
    if ($envContent -match "^NUXT_FIREBASE_ADMIN_SA=.*$") {
        $envContent = [System.Text.RegularExpressions.Regex]::Replace($envContent, "^NUXT_FIREBASE_ADMIN_SA=.*$", "NUXT_FIREBASE_ADMIN_SA=$encoded", 'Multiline')
    } else {
        $envContent = $envContent.TrimEnd() + "`nNUXT_FIREBASE_ADMIN_SA=$encoded`n"
    }

    # Salva o conteúdo atualizado no arquivo .env
    Set-Content -Path $EnvFilePath -Value $envContent -NoNewline
    Write-Output "Updated $EnvFilePath with NUXT_FIREBASE_ADMIN_SA"
}
