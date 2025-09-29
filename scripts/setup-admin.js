#!/usr/bin/env node

/**
 * Script para configurar usuários administrativos no Firebase
 *
 * Uso:
 * node scripts/setup-admin.js <email_do_usuario>
 *
 * Exemplo:
 * node scripts/setup-admin.js mediari.safeconfig.dev@gmail.com
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Função para carregar variáveis do arquivo .env
function loadEnvFile() {
  try {
    const envPath = resolve('.env');
    const envContent = readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach((line) => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } catch (_error) {
    console.warn('⚠️  Arquivo .env não encontrado ou não pôde ser carregado');
  }
}

// Função para inicializar Firebase Admin
function initializeFirebaseAdmin() {
  // Carregar variáveis do arquivo .env
  loadEnvFile();

  const serviceAccountBase64 = process.env.NUXT_FIREBASE_ADMIN_SA;

  if (!serviceAccountBase64) {
    console.error(
      '❌ Erro: Variável de ambiente NUXT_FIREBASE_ADMIN_SA não encontrada'
    );
    console.log(
      '💡 Configure a variável usando o script encode-service-account.ps1'
    );
    process.exit(1);
  }

  try {
    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      'base64'
    ).toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log('✅ Firebase Admin SDK inicializado com sucesso');
    return admin;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

// Função para encontrar usuário por email
async function findUserByEmail(email) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
}

// Função para configurar claims administrativas
async function setAdminClaims(uid, email) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(
      `✅ Claims administrativas configuradas para: ${email} (UID: ${uid})`
    );

    // Verificar se as claims foram aplicadas
    const userRecord = await admin.auth().getUser(uid);
    console.log('🔍 Custom claims verificadas:', userRecord.customClaims);

    return true;
  } catch (error) {
    console.error(`❌ Erro ao configurar claims para ${email}:`, error.message);
    return false;
  }
}

// Função para listar todos os usuários admin
async function listAdminUsers() {
  console.log('\n📋 Listando usuários com privilégios administrativos...\n');

  const listUsersResult = await admin.auth().listUsers();
  const adminUsers = [];

  for (const userRecord of listUsersResult.users) {
    if (userRecord.customClaims && userRecord.customClaims.admin === true) {
      const claims = userRecord.customClaims;
      const roleType = claims.superAdmin
        ? 'Super Admin'
        : claims.restrictedAdmin
          ? 'Restricted Admin'
          : 'Admin (sem role específica)';

      adminUsers.push({
        uid: userRecord.uid,
        email: userRecord.email,
        role: roleType,
        admin: claims.admin || false,
        superAdmin: claims.superAdmin || false,
        restrictedAdmin: claims.restrictedAdmin || false,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      });
    }
  }

  if (adminUsers.length === 0) {
    console.log('⚠️  Nenhum usuário administrativo encontrado');
  } else {
    console.log('📊 Usuários administrativos encontrados:\n');

    // Exibir informações detalhadas para cada usuário
    adminUsers.forEach((user, index) => {
      console.log(`👤 Usuário ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 UID: ${user.uid}`);
      console.log(`   👑 Role: ${user.role}`);
      console.log(`   🔐 Claims detalhadas:`);
      console.log(`      • admin: ${user.admin}`);
      console.log(`      • superAdmin: ${user.superAdmin}`);
      console.log(`      • restrictedAdmin: ${user.restrictedAdmin}`);
      console.log(`   📅 Criado em: ${user.creationTime}`);
      console.log(`   🕒 Último login: ${user.lastSignInTime || 'Nunca'}`);
      console.log(''); // Linha em branco
    });
  }

  return adminUsers;
}

// Função para verificar claims de um usuário específico
async function checkUserClaims(email) {
  console.log(`\n🔍 Verificando claims do usuário: ${email}\n`);

  try {
    const userRecord = await findUserByEmail(email);

    if (!userRecord) {
      console.error(`❌ Usuário não encontrado: ${email}`);
      return false;
    }

    console.log(`✅ Usuário encontrado: ${userRecord.email}`);
    console.log(`🆔 UID: ${userRecord.uid}`);
    console.log(`📅 Criado em: ${userRecord.metadata.creationTime}`);
    console.log(
      `🕒 Último login: ${userRecord.metadata.lastSignInTime || 'Nunca'}`
    );
    console.log(`🔒 Conta ${userRecord.disabled ? 'DESABILITADA' : 'ativa'}`);

    const claims = userRecord.customClaims || {};
    console.log('\n🔐 Claims detalhadas:');

    if (Object.keys(claims).length === 0) {
      console.log('   ⚠️  Nenhum claim personalizado encontrado');
    } else {
      console.log(`   • admin: ${claims.admin || false}`);
      console.log(`   • superAdmin: ${claims.superAdmin || false}`);
      console.log(`   • restrictedAdmin: ${claims.restrictedAdmin || false}`);

      // Mostrar outros claims se existirem
      const knownClaims = ['admin', 'superAdmin', 'restrictedAdmin'];
      const otherClaims = Object.keys(claims).filter(
        (key) => !knownClaims.includes(key)
      );

      if (otherClaims.length > 0) {
        console.log('   • Outros claims:');
        otherClaims.forEach((key) => {
          console.log(`     - ${key}: ${claims[key]}`);
        });
      }
    }

    // Determinar role
    const roleType = claims.superAdmin
      ? '👑 Super Admin'
      : claims.restrictedAdmin
        ? '🔒 Restricted Admin'
        : claims.admin
          ? '👤 Admin básico'
          : '🚫 Usuário comum (sem privilégios admin)';

    console.log(`\n🏷️  Role: ${roleType}`);

    return true;
  } catch (error) {
    console.error(`❌ Erro ao verificar usuário ${email}:`, error.message);
    return false;
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📖 Uso: node scripts/setup-admin.js <email_do_usuario>');
    console.log(
      '📖 Ou: node scripts/setup-admin.js --list (para listar admins existentes)'
    );
    console.log(
      '📖 Ou: node scripts/setup-admin.js --check <email> (para verificar claims de um usuário)'
    );
    console.log('\n📝 Exemplos:');
    console.log(
      '   node scripts/setup-admin.js mediari.safeconfig.dev@gmail.com'
    );
    console.log('   node scripts/setup-admin.js --list');
    console.log('   node scripts/setup-admin.js --check user@example.com');
    process.exit(1);
  }

  // Inicializar Firebase Admin
  initializeFirebaseAdmin();

  // Se for comando de listagem
  if (args[0] === '--list' || args[0] === '-l') {
    await listAdminUsers();
    process.exit(0);
  }

  // Se for comando de verificação de claims
  if (args[0] === '--check' || args[0] === '-c') {
    if (args.length < 2) {
      console.error('❌ Email do usuário é obrigatório para verificação');
      console.log('📝 Uso: node scripts/setup-admin.js --check <email>');
      process.exit(1);
    }

    const success = await checkUserClaims(args[1]);
    process.exit(success ? 0 : 1);
  }

  const email = args[0];

  if (!email.includes('@')) {
    console.error('❌ Email inválido:', email);
    process.exit(1);
  }

  console.log(`🔍 Procurando usuário: ${email}`);

  // Buscar usuário por email
  const userRecord = await findUserByEmail(email);

  if (!userRecord) {
    console.error(`❌ Usuário não encontrado: ${email}`);
    console.log(
      '💡 Certifique-se que o usuário já foi criado no Firebase Auth'
    );
    process.exit(1);
  }

  console.log(
    `✅ Usuário encontrado: ${userRecord.email} (UID: ${userRecord.uid})`
  );

  // Verificar se já possui claims admin
  if (userRecord.customClaims && userRecord.customClaims.admin === true) {
    console.log('⚠️  Este usuário já possui privilégios administrativos');
    console.log('🔍 Custom claims atuais:', userRecord.customClaims);
    process.exit(0);
  }

  // Configurar claims administrativas
  console.log('⚙️  Configurando privilégios administrativos...');
  const success = await setAdminClaims(userRecord.uid, userRecord.email);

  if (success) {
    console.log('\n🎉 Usuário administrativo configurado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. O usuário deve fazer logout e login novamente');
    console.log('2. Testar acesso aos endpoints administrativos');
    console.log('3. Verificar se o painel admin está funcionando');

    // Listar todos os admins atuais
    await listAdminUsers();
  } else {
    console.log('\n❌ Falha ao configurar usuário administrativo');
    process.exit(1);
  }
}

// Executar script
main()
  .then(() => {
    console.log('\n✅ Script executado com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro durante execução:', error);
    process.exit(1);
  });
