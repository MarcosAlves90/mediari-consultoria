/**
 * Tipo que representa os possíveis resultados de mapeamento de erros de autenticação do Firebase.
 * Cada valor corresponde a um tipo específico de erro que pode ocorrer durante a autenticação.
 */
export type AuthMapResult =
  | 'INVALID_CREDENTIALS'
  | 'USER_DISABLED'
  | 'TOO_MANY_REQUESTS'
  | 'NETWORK_ERROR'
  | 'EMAIL_ALREADY_IN_USE'
  | 'WEAK_PASSWORD'
  | 'OPERATION_NOT_ALLOWED'
  | 'USER_TOKEN_EXPIRED'
  | 'INVALID_EMAIL'
  | 'MISSING_EMAIL'
  | 'ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL'
  | 'CREDENTIAL_ALREADY_IN_USE'
  | 'POPUP_CLOSED_BY_USER'
  | 'CANCELLED_POPUP_REQUEST'
  | 'UNKNOWN_AUTH_ERROR';

/** Compact mapper: agrupa padrões por resultado e verifica sequencialmente. */
export function mapFirebaseAuthError(err: unknown): AuthMapResult {
  if (!err) return 'UNKNOWN_AUTH_ERROR';

  // Coleta candidatos de texto do erro para análise
  const candidates: string[] = [];
  if (typeof err === 'string') candidates.push(err);
  const e = err as Record<string, unknown>;
  if (e.code) candidates.push(String(e.code));
  if (e.message) candidates.push(String(e.message));
  try {
    candidates.push(String(err));
  } catch (pushErr) {
    console.warn(
      '[mapFirebaseAuthError] falha ao converter erro para string',
      pushErr
    );
  }

  try {
    const resp = e.response as Record<string, unknown> | undefined;
    if (resp && resp.data !== undefined) {
      const d = resp.data as unknown;
      candidates.push(typeof d === 'string' ? d : JSON.stringify(d));
      if (d && typeof d === 'object') {
        const obj = d as Record<string, unknown>;
        if (obj.error) candidates.push(String(obj.error));
        if (obj.message) candidates.push(String(obj.message));
      }
    }
  } catch (ex) {
    console.warn('[mapFirebaseAuthError] falha ao analisar response.data', ex);
  }

  // Junta todos os candidatos em uma string minúscula para busca
  const raw = candidates.join(' | ').toLowerCase();

  // Padrões de correspondência para cada tipo de erro
  const patterns: Record<AuthMapResult, string[]> = {
    INVALID_CREDENTIALS: [
      'invalid-credential',
      'invalid credential',
      'user-not-found',
      'wrong-password',
      'invalid-email-password-combination',
      'incorrect email',
      'incorrect password',
      'sign_in_failed',
      'invalid_login_credentials',
      'auth credential is incorrect',
      'malformed',
      'has expired',
      'not currently supported',
    ],
    USER_DISABLED: [
      'user-disabled',
      'user disabled',
      'account-disabled',
      'disabled',
    ],
    TOO_MANY_REQUESTS: [
      'too-many-requests',
      'too many requests',
      'quota',
      'rate limit',
      'temporarily blocked',
    ],
    NETWORK_ERROR: [
      'network-request-failed',
      'network error',
      'timeout',
      'failed to fetch',
      'offline',
      'no internet',
    ],
    EMAIL_ALREADY_IN_USE: [
      'email-already-in-use',
      'email already in use',
      'address is already in use',
    ],
    WEAK_PASSWORD: [
      'weak-password',
      'weak password',
      'password-does-not-meet-requirements',
      'password should be at least',
      'password must be',
    ],
    OPERATION_NOT_ALLOWED: [
      'operation-not-allowed',
      'operation not allowed',
      'sign-in method',
      'provider-not-enabled',
    ],
    USER_TOKEN_EXPIRED: [
      'id-token-expired',
      'token-expired',
      'session expired',
      'user-token-expired',
    ],
    INVALID_EMAIL: ['invalid-email', 'badly formatted', 'malformed email'],
    MISSING_EMAIL: ['missing-email', 'missing email', 'email-required'],
    ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL: [
      'account-exists-with-different-credential',
      'account exists with different credential',
      'email-already-associated',
    ],
    CREDENTIAL_ALREADY_IN_USE: [
      'credential-already-in-use',
      'already-linked',
      'provider-already-linked',
    ],
    POPUP_CLOSED_BY_USER: [
      'popup-closed-by-user',
      'popup closed by user',
      'cancelled-popup-request',
      'popup-blocked',
    ],
    CANCELLED_POPUP_REQUEST: [
      'popup-request-cancelled',
      'auth-domain-config-required',
      'unauthorized-domain',
    ],
    UNKNOWN_AUTH_ERROR: [],
  };

  // Verifica cada padrão sequencialmente e retorna o primeiro que corresponder
  for (const key of Object.keys(patterns) as Array<AuthMapResult>) {
    const pats = patterns[key];
    if (!pats || pats.length === 0) continue;
    for (const p of pats) if (raw.includes(p)) return key;
  }

  return 'UNKNOWN_AUTH_ERROR';
}
