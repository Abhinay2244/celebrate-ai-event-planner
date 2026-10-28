import 'dotenv/config';
import express, { Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes.ts';
import { jsonSyntaxErrorHandler, finalErrorHandler } from './server/middleware/errorHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates and configures the Express application with security,
 * parsing limits, routes, and error handling.
 */
export function createApp(): Express {
  const app = express();

  // Security headers with strict nosniff and referrer policy
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
      crossOriginEmbedderPolicy: false,
      xContentTypeOptions: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      dnsPrefetchControl: { allow: false },
      hidePoweredBy: true,
    })
  );

  // Strict request body size limit (250KB max)
  app.use(express.json({ limit: '250kb' }));

  // JSON syntax and payload size limit middleware
  app.use(jsonSyntaxErrorHandler);

  // Mount API routes
  app.use('/api', apiRouter);

  return app;
}

/**
 * Boots the server with Vite middleware in development or static assets in production.
 */
export async function startServer(): Promise<void> {
  const app = createApp();
  const port = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Final catch-all error handling middleware
  app.use(finalErrorHandler);

  app.listen(port, '0.0.0.0', () => {
    console.log(`🎉 Celebrate AI server listening on http://0.0.0.0:${port}`);
  });
}

// Automatically start server when executed directly and not running in test suite
const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
if (!isTestEnv) {
  startServer().catch((err) => {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  });
}
