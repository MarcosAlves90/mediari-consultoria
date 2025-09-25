/**
 * Middleware global para configurar headers CORS
 * Aplicado a todas as rotas da API do servidor
 */
export default defineEventHandler(async (event) => {
  // Configurar headers CORS para todas as requisições da API
  if (getRequestURL(event).pathname.startsWith('/api/')) {
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, x-goog-acl, x-goog-if-generation-match, x-goog-if-metageneration-match',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Expose-Headers': 'Content-Length, Content-MD5, ETag',
    });

    // Handle preflight requests
    if (event.node.req.method === 'OPTIONS') {
      return sendNoContent(event);
    }
  }

  // Continue com o processamento normal
  return;
});
