import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * This plugin serves the `/assets/env-config.js` file with proper environment variables
 */

export function renderTemplateWithEnvVars(content: string): string {
  let result = content;
  const regex = /\$\{([a-zA-Z_]+[a-zA-Z0-9_]*?)\}/g;

  let matched: RegExpExecArray | null;
  while ((matched = regex.exec(content))) {
    result = result.replace(`\${${matched[1]}}`, process.env[matched[1]] || '');
  }

  return result;
}

export function envConfig(): Plugin {
  let root: string | undefined;
  return {
    name: 'vite-plugin-env-config',
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      if (!root) {
        throw new Error('envConfig plugin requires a root directory');
      }
      let appConfigContent = '';
      const TEMPLATE_PATH = path.join(root, 'src', 'assets', 'env-config.template.js');

      void (async () => {
        const content = (await fs.promises.readFile(TEMPLATE_PATH)).toString();
        appConfigContent = renderTemplateWithEnvVars(content);
      })();

      server.middlewares.use((req, res, next) => {
        if (req.url === '/assets/env-config.js') {
          // standard headers
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Content-Length', Buffer.byteLength(appConfigContent, 'utf8'));

          // body
          res.end(appConfigContent, 'utf8');
          return;
        }
        next();
      });
    },
  };
}
