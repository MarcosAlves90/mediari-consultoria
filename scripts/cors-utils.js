#!/usr/bin/env node
import { config } from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv para carregar as variáveis do .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

if (!BUCKET) {
  console.error('❌ Variável FIREBASE_STORAGE_BUCKET não encontrada no .env');
  process.exit(1);
}

const command = process.argv[2];
const bucketUri = `gs://${BUCKET}`;

switch (command) {
  case 'configure':
    console.log(`🔧 Configurando CORS para bucket: ${BUCKET}`);
    spawn(
      'gcloud',
      [
        'storage',
        'buckets',
        'update',
        bucketUri,
        '--cors-file=firebase/cors.json',
      ],
      {
        stdio: 'inherit',
        shell: true,
      }
    );
    break;

  case 'check':
    console.log(`🔍 Verificando CORS do bucket: ${BUCKET}`);
    spawn(
      'gcloud',
      [
        'storage',
        'buckets',
        'describe',
        bucketUri,
        '--format=json(cors_config)',
      ],
      {
        stdio: 'inherit',
        shell: true,
      }
    );
    break;

  default:
    console.log(`
🛠️  Utilitário CORS para Firebase Storage

Uso:
  npm run cors:configure  - Configura CORS no bucket
  npm run cors:check      - Verifica configuração CORS

Bucket configurado: ${BUCKET}
    `);
    break;
}
