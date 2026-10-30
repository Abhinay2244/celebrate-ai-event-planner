import 'dotenv/config';
import express, { Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes.ts';
import { bodyParserErrorHandler, finalErrorHandler } from './server/middleware/errorHandler.ts';
import { SERVER_CONFIG } from './src/constants/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Mounts Vite development middleware in dev or static asset serving in production.
 * Caches the Vite server creation promise so concurrent startup requests share one instance.
 */
export function mountFrontend(app: Express): void {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    let vitePromise: Promise<import('vite').ViteDevServer> | null = null;
    app.use(async (req, res, next) => {
      try {
        if (!vitePromise) {
          vitePromise = import('vite').then(({ createServer: createViteServer }) =>
            createViteServer({
              server: { middlewareMode: true },
              appType: 'spa',
            })
          );
        }
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

/**
 * Creates and configures the Express application.
 * Accepts an optional frontend mounter function so Vite/static setup runs before finalErrorHandler.
 */
export function createApp(frontendMounter?: (app: Express) => void): Express {
  const app = express();

  // Trust proxy for reverse proxy environments (e.g. Google Cloud Run, load balancers)
  app.set('trust proxy', 1);

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

  // Strict request body size limit
  app.use(express.json({ limit: SERVER_CONFIG.JSON_BODY_LIMIT }));

  // JSON syntax and payload size limit middleware
  app.use(bodyParserErrorHandler);

  // Mount API routes
  app.use('/api', apiRouter);

  // JSON 404 handler for unmatched /api routes before frontend fallback
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: `Cannot ${req.method} ${req.originalUrl}`,
      requestId: req.id ?? 'unknown',
    });
  });

  // Mount frontend assets/vite middleware if provided
  if (frontendMounter) {
    frontendMounter(app);
  }

  // Final catch-all error handling middleware is registered last
  app.use(finalErrorHandler);

  return app;
}

/**
 * Boots the server and starts listening on configured host and port.
 */
export async function startServer(): Promise<void> {
  const app = createApp(mountFrontend);
  const port = parseInt(process.env.PORT || String(SERVER_CONFIG.PORT), 10);

  app.listen(port, SERVER_CONFIG.HOST, () => {
    console.log(`🎉 Celebrate AI server listening on http://${SERVER_CONFIG.HOST}:${port}`);
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
