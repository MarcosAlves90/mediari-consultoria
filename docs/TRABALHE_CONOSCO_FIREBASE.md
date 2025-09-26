# Sistema "Trabalhe Conosco" — Documentação Técnica Firebase

Este documento apresenta a especificação técnica completa do sistema "Trabalhe Conosco", detalhando
a integração com Firebase e os requisitos para implantação em produção.

## Sumário

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura de Componentes](#2-arquitetura-de-componentes)
3. [Especificação das APIs](#3-especificação-das-apis)
4. [Gerenciamento de Storage](#4-gerenciamento-de-storage)
5. [Estrutura do Firestore](#5-estrutura-do-firestore)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [Regras de Segurança](#7-regras-de-segurança)
8. [Monitoramento e Manutenção](#8-monitoramento-e-manutenção)
9. [Ambiente de Desenvolvimento](#9-ambiente-de-desenvolvimento)
10. [Checklist de Produção](#10-checklist-de-produção)
11. [Troubleshooting](#11-troubleshooting)
12. [Configuração de Service Account](#12-configuração-de-service-account)

---

## 1. Visão Geral do Sistema

O sistema "Trabalhe Conosco" implementa um fluxo completo de candidatura com as seguintes etapas:

1. **Preenchimento do formulário**: O usuário preenche o `JobApplicationForm` e seleciona um arquivo
   de currículo local.

2. **Solicitação de upload**: Ao enviar, o cliente solicita ao servidor um signed URL para upload
   através do endpoint `/api/careers/upload-url`.

3. **Upload do arquivo**: O cliente executa um PUT do arquivo para o signed URL (via XMLHttpRequest
   para monitoramento de progresso) acompanhando o `uploadProgress`.

4. **Submissão dos dados**: Após o upload ser bem-sucedido, o cliente chama `/api/careers/submit`
   enviando os metadados do candidato junto com o `storagePath` retornado.

5. **Processamento servidor**: O servidor (usando Admin SDK) cria o documento em `candidates/{id}`,
   move o arquivo de `candidates/temp/...` para `candidates/{id}/{filename}` e atualiza o documento
   com informações de `attachments`.

6. **Vinculação de sessão**: O cliente recebe o `candidateId` e armazena em `sessionStorage` (chave
   `mediari-candidate-id`) para vincular ao ProfileTest.

7. **Teste de perfil**: O usuário realiza o `ProfileTest`; o cliente chama `/api/careers/profile`
   enviando as respostas junto com o `candidateId` (quando disponível).

8. **Armazenamento de resultados**: O servidor grava o resultado em `candidates/{id}/profileTests`
   (subcoleção) ou em uma coleção global se `candidateId` estiver ausente.

---

## 2. Arquitetura de Componentes

### Componentes Frontend

- **`components/page-trabalhe-conosco/molecules/JobApplicationForm.vue`**
  - Interface do formulário de candidatura
  - Exibe barra de progresso `uploadProgress` durante o upload
  - Emite evento `submitted` quando o processo é concluído

### Composables

- **`composables/trabalhe-conosco/useJobApplicationForm.ts`**
  - Gerencia estado reativo do formulário e validação
  - Implementa persistência em `sessionStorage` (excluindo arquivos)
  - Controla `uploadProgress` e método `submitForm()`

- **`composables/trabalhe-conosco/useProfileTest.ts`**
  - Gerencia respostas do teste de perfil
  - Implementa persistência no `sessionStorage`
  - Contém método `submitProfileTest()` para comunicação com o servidor

- **`composables/trabalhe-conosco/useCandidateService.ts`**
  - Orquestra a comunicação com os endpoints do servidor:
    - `POST /api/careers/upload-url` → retorna `{ uploadUrl, storagePath }`
    - Executa PUT do arquivo via XMLHttpRequest com relatório de progresso
    - `POST /api/careers/submit` → cria candidato e retorna `{ candidateId }`
    - `POST /api/careers/profile` → submete respostas do teste de perfil

### Utilitários do Servidor

- **`server/utils/firebaseAdmin.ts`**
  - Inicializa Firebase Admin SDK
  - Detecta automaticamente se está em modo emulator ou produção
  - Suporta autenticação via `NUXT_FIREBASE_ADMIN_SA` (base64) para produção
  - Configuração automática para emulators em desenvolvimento

- **`server/utils/cleanTempFiles.ts`**
  - Utilitário para limpeza automática de arquivos temporários
  - Suporte a dry-run para testes
  - Configurável por idade de arquivo em horas

---

## 3. Especificação das APIs

### Endpoint: Upload URL (Atualizado)

**`POST /api/careers/upload-url`**

Gera signed URL para upload seguro de arquivos em produção ou retorna endpoint direto para
emulators.

**Request Body:**

```json
{
  "fileName": "curriculo.pdf",
  "contentType": "application/pdf"
}
```

**Response (Produção):**

```json
{
  "uploadUrl": "https://storage.googleapis.com/...",
  "storagePath": "candidates/temp/1660000000000-curriculo.pdf"
}
```

**Response (Emulator):**

```json
{
  "uploadUrl": "/api/careers/upload-direct",
  "storagePath": "candidates/temp/1660000000000-curriculo.pdf",
  "emulatorMode": true,
  "fileName": "curriculo.pdf"
}
```

### Endpoint: Upload Direto (Apenas Emulator)

**`POST /api/careers/upload-direct`**

Upload direto de arquivos para o Storage Emulator via multipart form.

**Request:** Multipart form data com campo `file`

**Response:**

```json
{
  "success": true,
  "storagePath": "candidates/temp/1660000000000-curriculo.pdf",
  "fileName": "curriculo.pdf"
}
```

### Endpoint: Submit Candidatura

**`POST /api/careers/submit`**

Processa os dados do candidato e organiza arquivos no storage.

**Request Body:**

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "phone": "(11) 99999-9999",
  "positionApplied": "Consultor",
  "storagePath": "candidates/temp/166...-curriculo.pdf"
}
```

**Response:**

```json
{
  "candidateId": "abc123"
}
```

**Comportamento do Servidor (Atualizado):**

- Cria documento `candidates/{candidateId}` com os campos: `firstName`, `lastName`, `email`,
  `phone`, `positionApplied`, `status`, `createdAt`, `updatedAt`
- Se `storagePath` estiver presente:
  - **Produção**: Move o arquivo de `candidates/temp/...` para `candidates/{candidateId}/{filename}`
    utilizando método `move()` do storage client, com fallback para copy+delete
  - **Emulator**: Registra arquivo no documento sem movimentação (para compatibilidade de testes)
  - Atualiza o documento com informações de `attachments` incluindo `name`, `storagePath` (final em
    produção, original em emulator) e `uploadedAt`

### Endpoint: Profile Test

**`POST /api/careers/profile`**

Armazena respostas do teste de perfil do candidato.

**Request Body:**

```json
{
  "candidateId": "abc123",
  "answers": {
    "0": "A",
    "1": "B",
    "2": "C"
  }
}
```

**Response:**

```json
{
  "ok": true
}
```

**Comportamento do Servidor:**

- **Com `candidateId`**: Grava documento em `candidates/{candidateId}/profileTests/{autoId}`
  incluindo `answers` e `createdAt`
- **Sem `candidateId`**: Grava em coleção global `profileTests` para associação posterior manual ou
  automatizada

### Endpoint: Admin Download

**`POST /api/admin/careers/download`** _(Protegido)_

Gera signed URL para download seguro de arquivos por administradores.

**Request Body:**

```json
{
  "storagePath": "candidates/abc123/curriculo.pdf"
}
```

**Response:**

```json
{
  "downloadUrl": "https://storage.googleapis.com/..."
}
```

**Segurança:**

- Validação de cookie `mediari_session` via Admin SDK
- Verificação de custom claim `admin: true`
- URL com validade de 10 minutos

---

## 4. Gerenciamento de Storage

### Estrutura de Diretórios

O Firebase Storage é organizado com a seguinte hierarquia:

```text
candidates/
├── temp/                           # Arquivos temporários durante upload
│   └── {timestamp}-{filename}      # Ex: 1660000000000-curriculo.pdf
└── {candidateId}/                  # Arquivos organizados por candidato
    └── {filename}                  # Ex: curriculo.pdf
```

### Políticas de Movimentação

**Upload Temporário:**

- Arquivos são inicialmente enviados para `candidates/temp/` via signed URL
- Nome do arquivo inclui timestamp para evitar conflitos
- Signed URLs têm validade de 10 minutos

**Organização Final:**

- Após criação do candidato, arquivos são movidos para `candidates/{candidateId}/`
- Utiliza método `move()` do Storage Client (quando disponível)
- Fallback para operação copy+delete em caso de falha

**Limpeza Automática:**

- Utilitário `server/utils/cleanTempFiles.ts` remove arquivos temporários antigos
- Configurável por limite de tempo (recomendado: 24 horas)
- Pode ser agendado como Cloud Function ou job

### Implementações de Segurança

**Signed URLs:**

- Upload: POST para `server/api/careers/upload-url.post.ts`
- Download: POST para `server/api/admin/careers/download.post.ts` (protegido)

**Controle de Acesso:**

- Sem upload público direto
- Acesso administrativo protegido por autenticação
- URLs com validade limitada

## 5. Estrutura do Firestore

### Coleção `candidates`

Armazena informações principais dos candidatos.

**Estrutura do Documento (Atualizada):**

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "phone": "(11) 99999-9999",
  "positionApplied": "Consultor Jurídico",
  "status": "submitted",
  "createdAt": "2025-09-14T22:35:42.179Z",
  "updatedAt": "2025-09-14T22:35:42.179Z",
  "attachments": [
    {
      "name": "curriculo.pdf",
      "storagePath": "candidates/abc123/curriculo.pdf",
      "uploadedAt": "2025-09-14T22:35:42.179Z",
      "moved": true
    }
  ]
}
```

**Observações:**

- Em **produção**: usa `admin.firestore.FieldValue.serverTimestamp()` para timestamps
- Em **emulator**: usa `new Date().toISOString()` para compatibilidade

### Subcoleção `candidates/{id}/profileTests`

Armazena resultados dos testes de perfil vinculados a cada candidato.

**Estrutura do Documento:**

```json
{
  "answers": {
    "0": "A",
    "1": "B",
    "2": "C",
    "3": "D"
  },
  "createdAt": "<serverTimestamp>"
}
```

### Coleção Global `profileTests` (Alternativa)

Utilizada quando `candidateId` não está disponível durante o teste.

**Estrutura do Documento:**

```json
{
  "candidateId": "abc123", // opcional
  "answers": {
    "0": "A",
    "1": "B",
    "2": "C"
  },
  "createdAt": "<serverTimestamp>",
  "associatedAt": "<serverTimestamp>" // quando vinculado posteriormente
}
```

### Índices Recomendados

Para otimização de consultas:

- `candidates`: composto por `status` + `createdAt` (descendente)
- `candidates`: composto por `positionApplied` + `createdAt` (descendente)
- `profileTests`: simples em `createdAt` (descendente)

---

## 6. Autenticação e Autorização

### Arquitetura de Autenticação

**Firebase Admin SDK:**

- O backend utiliza Firebase Admin SDK para operações administrativas
- Autenticação administrativa realizada via session cookies
- Nome do cookie: `mediari_session`

### Middleware de Segurança

**`server/middleware/adminAuth.ts`:**

- Valida cookies de sessão para rotas `/admin/**`
- Implementa verificação de claims personalizados

**Endpoints Administrativos (`/api/admin/**`):\*\*

- Validação obrigatória do cookie `mediari_session`
- Verificação de custom claim `admin === true`
- Implementação de verificação defensiva em todos os handlers

### Configuração de Privilégios

Para definir privilégios administrativos:

```javascript
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

### Fluxo de Autenticação

1. **Login administrativo** → Criação de session cookie
2. **Validação middleware** → Verificação automática em rotas protegidas
3. **Autorização endpoint** → Validação de claims específicos
4. **Acesso controlado** → Liberação de recursos administrativos

---

## 7. Regras de Segurança

> **Importante:** As regras apresentadas são exemplos conceituais. Adapte conforme suas políticas de
> segurança e requisitos legais.

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção de candidatos - apenas admin
    match /candidates/{candidateId} {
      allow create: if request.auth.token.admin == true;
      allow read: if request.auth.token.admin == true;
      allow update: if request.auth.token.admin == true;
      allow delete: if false; // Nunca permitir exclusão
    }

    // Testes de perfil - apenas admin
    match /candidates/{candidateId}/profileTests/{testId} {
      allow create: if request.auth.token.admin == true;
      allow read: if request.auth.token.admin == true;
      allow update: if false;
      allow delete: if false;
    }

    // Coleção global de testes (quando candidateId ausente)
    match /profileTests/{testId} {
      allow create: if request.auth.token.admin == true;
      allow read: if request.auth.token.admin == true;
      allow update: if request.auth.token.admin == true;
      allow delete: if false;
    }
  }
}
```

### Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Diretório temporário - sem acesso direto
    match /candidates/temp/{fileName} {
      allow read, write: if false;
    }

    // Arquivos de candidatos - apenas admin
    match /candidates/{candidateId}/{fileName} {
      allow read: if request.auth.token.admin == true;
      allow write: if false; // Apenas via signed URLs
      allow delete: if request.auth.token.admin == true;
    }
  }
}
```

### Princípios de Segurança Aplicados

**Controle de Acesso por IAM:**

- Utilização exclusiva de signed URLs para upload/download
- Sem permissões públicas diretas no Storage
- Validação de tokens administrativos em todas as operações

**Princípio do Menor Privilégio:**

- Usuários finais: sem acesso direto ao Firestore/Storage
- Administradores: acesso limitado às operações necessárias
- Sistema: operações via service account com escopo restrito

---

---

## 8. Monitoramento e Manutenção

### Sistema de Logs

**Captura de Eventos Críticos:**

- Falhas de upload de arquivos
- Erros na movimentação de arquivos temporários
- Falhas no commit de dados no Firestore
- Tentativas de acesso não autorizado

**Integração Recomendada:**

- **Sentry**: Para monitoramento de erros em tempo real
- **Google Cloud Logging**: Para logs estruturados e análises
- **Console logs**: Já implementados com `console.error` nos handlers

### Métricas de Performance

**KPIs Essenciais:**

- Taxa de sucesso de uploads
- Tempo médio de processamento de candidaturas
- Falhas na movimentação de arquivos
- Volume de candidaturas por período

### Limpeza Automática

**Utilitário de Limpeza:**

```javascript
// server/utils/cleanTempFiles.ts
import { cleanTempFiles } from "./cleanTempFiles";

// Remove arquivos temporários com mais de 24 horas
await cleanTempFiles({ maxAgeHours: 24 });
```

**Opções de Agendamento:**

1. **Cloud Function + Cloud Scheduler:**

   ```bash
   # Executar diariamente às 2:00 AM
   0 2 * * * gcloud functions call cleanTemporaryFiles
   ```

2. **Cloud Run Job:**
   - Deploy como job containerizado
   - Agendamento via Cloud Scheduler
   - Melhor controle de recursos
   - Melhor controle de recursos

### Políticas de Retenção

**Conformidade LGPD:**

- **Documentar período de retenção** dos currículos
- **Implementar processo de arquivamento/exclusão** automática
- **Mecanismo de remoção** sob solicitação do candidato
- **Logs de auditoria** para operações de dados pessoais

**Recomendações:**

- Retenção padrão: 12 meses
- Arquivamento após processo seletivo
- Exclusão automática após expiração
- Backup segregado para auditoria

---

## 9. Ambiente de Desenvolvimento

### Configuração do Firebase Emulator

**1. Instalação do Firebase Tools:**

```bash
npm install -g firebase-tools
```

**2. Configuração do `firebase.json`:**

Configure emulators para `firestore`, `storage` e `auth`:

```json
{
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "auth": {
      "port": 9099
    }
  }
}
```

**3. Inicialização dos Emulators:**

```bash
firebase emulators:start
```

### Configuração de Variáveis de Ambiente

**4. Configuração da Service Account:**

Configure `NUXT_FIREBASE_ADMIN_SA` apontando para a conta de serviço do emulator ou adapte
`firebaseAdmin` para detectar emulator via `FIREBASE_AUTH_EMULATOR_HOST`.

### Fluxo de Testes Atualizado

**5. Validação Completa do Sistema:**

1. **Upload URL:** `POST /api/careers/upload-url` → obter `uploadUrl` e `storagePath`
2. **Upload Arquivo:**
   - **Produção**: PUT do arquivo para `uploadUrl` (signed URL)
   - **Emulator**: POST multipart para `/api/careers/upload-direct`
3. **Submit Candidatura:** `POST /api/careers/submit` com `storagePath` → verificar documento
   `candidates/{id}` criado
4. **Profile Test:** `POST /api/careers/profile` → verificar subcoleção `profileTests`

**Exemplo de Upload via cURL (Emulator):**

```bash
curl -X POST http://localhost:3000/api/careers/upload-direct \
     -F "file=@curriculo.pdf"
```

**Exemplo de Upload via cURL (Produção):**

```bash
curl -X PUT "<uploadUrl>" \
     -H "Content-Type: application/pdf" \
     --data-binary @curriculo.pdf
```

> **Nota:** signed URLs variam a cada solicitação

---

## 10. Checklist de Produção

### Configuração de Infraestrutura

- [x] **Service Account:** Criar e configurar conta de serviço com permissões necessárias ✅
- [ ] **Variáveis de Ambiente:** Definir `NUXT_FIREBASE_ADMIN_SA` (base64) no ambiente de deploy
- [x] **Firestore Rules:** Validar e publicar Firestore Rules ✅
- [X] **Storage Setup:** Ativar Firebase Storage no console e publicar policies

### Segurança e Autenticação

- [x] **Middleware Admin:** Configurar e verificar `server/middleware/adminAuth.ts` ✅
- [x] **Session Cookies:** Validar criação/validação de cookie `mediari_session` no fluxo admin ✅
- [x] **Endpoint Protection:** Verificar proteção de todos os endpoints `/api/admin/**` ✅

### Monitoramento e Manutenção

- [ ] **Rotina de Limpeza:** Agendar limpeza para `candidates/temp` (Cloud Scheduler/Function/Run)
- [ ] **Sistema de Logs:** Implementar monitoramento para falhas em `/api/careers/submit`
- [ ] **Alertas:** Configurar alerts para operações críticas de Storage
- [x] **Testes E2E:** Executar testes completos no Firebase Emulator ✅

### Conformidade Legal

- [ ] **LGPD Compliance:** Revisar consentimento, período de retenção, mecanismo de remoção
- [ ] **Política de Privacidade:** Documentar tratamento de dados pessoais
- [ ] **Workflow Admin:** Implementar acesso a signed download URLs via painel administrativo

---

## 11. Troubleshooting

### Problemas Comuns

**Upload Falha (XMLHttpRequest):**

- **Sintomas:** Erro durante upload do arquivo
- **Diagnóstico:** Verificar validade do signed URL (10 minutos) e Content-Type correto
- **Solução:** Cliente deve exibir erro e permitir reenvio; gerar novo signed URL se necessário

**Falha na Movimentação de Arquivos:**

- **Sintomas:** Arquivo permanece em `candidates/temp/`
- **Comportamento:** Servidor salva `attachments` com `moveFailed: true` e `storagePath` original
- **Solução:** Verificar logs do servidor, executar correção manual ou implementar reprocessamento
  automático

**CandidateId Não Recebido:**

- **Sintomas:** Frontend não recebe `candidateId` após submissão
- **Diagnóstico:** Verificar se `/api/careers/submit` retornou status 500
- **Solução:** Analisar logs do servidor, verificar conectividade com Firestore

**Problemas com Arquivos Grandes:**

- **Sintomas:** Timeout durante upload ou processamento
- **Considerações:** Limites de tamanho (Storage e rede), timeouts de requisição
- **Solução:** Implementar uploads resumáveis (multipart) para arquivos > 10MB

### Comandos de Diagnóstico

**Verificar Service Account:**

```bash
npm run validate:firebase-sa
```

**Limpeza Manual de Arquivos Temporários:**

```bash
node ./server/utils/cleanTempFiles.js
```

**Teste de Conectividade:**

```bash
curl -X POST http://localhost:3000/api/careers/upload-url \
     -H "Content-Type: application/json" \
     -d '{"fileName":"test.pdf","contentType":"application/pdf"}'
```

### Scripts de Manutenção

**Geração Manual de Signed URL:**

- Endpoint: `POST /api/careers/upload-url`
- Parâmetros: `fileName` e `contentType`

**Movimentação Manual de Arquivo:**

- Utilizar script administrativo com Admin SDK
- Operações: copiar/mover e atualizar documento `attachments`

## 12. Configuração de Service Account

### Visão Geral

Esta seção apresenta os procedimentos para configurar a variável `NUXT_FIREBASE_ADMIN_SA`, que
contém a codificação base64 do arquivo JSON da service account, necessária para autenticação com
Firebase Admin SDK.

### Método 1: Script Automatizado (Recomendado)

O projeto inclui um script PowerShell que automatiza o processo de codificação e configuração.

**1. Codificação e Exibição:**

```powershell
npm run encode:service-account -- -ServiceAccountPath "C:\caminho\para\service-account.json"
```

**2. Codificação com Atualização Automática do .env:**

```powershell
npm run encode:service-account -- -ServiceAccountPath "C:\caminho\para\service-account.json" -UpdateEnv
```

**3. Especificando Arquivo .env Personalizado:**

```powershell
npm run encode:service-account -- -ServiceAccountPath "C:\caminho\para\service-account.json" -EnvFilePath ".env.local" -UpdateEnv
```

### Método 2: Configuração Manual

**Pré-requisitos:**

1. Baixar o arquivo JSON da Service Account no Google Cloud Console
2. Verificar permissões necessárias (Storage + Firestore)

**Processo Manual no PowerShell:**

**1. Gerar String Base64:**

```powershell
$json = Get-Content -Raw -Path 'C:\caminho\para\service-account.json'
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
Write-Output $b64
```

**2. Configurar Variável de Ambiente (Sessão Atual):**

```powershell
$env:NUXT_FIREBASE_ADMIN_SA = $b64
```

### Configuração em Produção

**Ambientes de Deploy:**

- **Netlify/Vercel:** Cole a string base64 no painel de variáveis de ambiente
- **Google Cloud:** Configure via Cloud Console ou gcloud CLI
- **Docker:** Inclua no arquivo docker-compose.yml ou Dockerfile

**Chave da Variável:**

```text
NUXT_FIREBASE_ADMIN_SA
```

**Valor:** String base64 gerada pelos métodos acima

### Boas Práticas de Segurança

**Proteção de Credenciais:**

- ❌ Nunca commit o JSON da service account no repositório
- ❌ Não incluir a string base64 em arquivos versionados
- ✅ Usar variáveis de ambiente ou serviços de secrets management
- ✅ Marcar como "sensível" nos painéis de deploy quando disponível

**Gerenciamento de Permissões:**

- Configure service account com **permissões mínimas necessárias**
- Prefira roles específicos ao invés de permissões amplas
- Monitore uso através dos logs de auditoria do Google Cloud

**Rotação de Credenciais:**

- Implemente rotação periódica das service accounts
- Mantenha backup das configurações de produção
- Documente processo de atualização para emergências

### Validação da Configuração

**Script de Validação:**

```bash
npm run validate:firebase-sa
```

**Verificações Realizadas:**

- Existência da variável de ambiente
- Validade do JSON decodificado
- Conectividade com Firebase Admin SDK
- Permissões básicas de Storage e Firestore
