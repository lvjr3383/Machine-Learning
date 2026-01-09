import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createOracleMiddleware } from './server/oracle';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const geminiApiKey = env.GEMINI_API_KEY || env.API_KEY || '';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), oracleApiPlugin(geminiApiKey)],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

function oracleApiPlugin(apiKey: string) {
  const middleware = createOracleMiddleware(apiKey);
  return {
    name: 'oracle-api',
    configureServer(server) {
      server.middlewares.use('/api/oracle', middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/oracle', middleware);
    }
  };
}
