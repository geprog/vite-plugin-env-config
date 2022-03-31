import type { Plugin } from 'vite';

export function createEnvConfigContent(variables: string[], template: boolean): string {
  let templateContent = '';
  templateContent += '(function(window){window.env=window.env||{};';
  variables.forEach((variable) => {
    if (template) {
      templateContent += `window.env['${variable}']='\${${variable}}';`;
    } else {
      templateContent += `window.env['${variable}']='${process.env[variable] || ''}';`;
    }
  });
  templateContent += '})(this);';
  return templateContent;
}

export interface EnvConfigOptions {
  /**
   * List of environment variables (case-sensitive) to make available in the frontend.
   * @default []
   * @example ['BACKEND_URL']
   */
  variables: string[];
}

export function envConfig(userOptions: Partial<EnvConfigOptions> = {}): Plugin {
  return {
    name: 'vite-plugin-env-config',

    configureServer(server) {
      const envConfigContent = createEnvConfigContent(userOptions.variables || [], false);

      server.middlewares.use((req, res, next) => {
        if (req.url === '/env-config.js') {
          // standard headers
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Content-Length', Buffer.byteLength(envConfigContent, 'utf8'));

          // body
          res.end(envConfigContent, 'utf8');
          return;
        }
        next();
      });
    },

    generateBundle() {
      const templateContent = createEnvConfigContent(userOptions.variables || [], true);
      this.emitFile({
        type: 'asset',
        fileName: 'env-config.template.js',
        source: templateContent,
      });
    },

    transformIndexHtml(html) {
      return html.replace('</head>', '<script src="/env-config.js"></script></head>');
    },
  };
}
