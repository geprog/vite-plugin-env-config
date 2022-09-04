import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import request from 'supertest';
import { build, createServer, ViteDevServer } from 'vite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createEnvConfigContent, envConfig } from '~/envConfig';

describe('createEnvConfigContent', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('creates an env-config containing given variables and their values', () => {
    // given
    const variables = ['BACKEND_URL', 'FOO', 'NOT_SET'];
    process.env.BACKEND_URL = 'http://localhost:4000';
    process.env.FOO = 'bar';

    // when
    const result = createEnvConfigContent(variables, false);

    // then
    expect(result).toContain(`window.env['BACKEND_URL']='${process.env.BACKEND_URL}';`);
    expect(result).toContain(`window.env['FOO']='${process.env.FOO}';`);
    expect(result).toContain(`window.env['NOT_SET']='';`);
    expect(result).toMatchSnapshot();
  });

  it('creates an env-config containing given variables and placeholders', () => {
    // given
    const variables = ['BACKEND_URL', 'FOO'];

    // when
    const result = createEnvConfigContent(variables, true);

    // then
    expect(result).toContain(`window.env['BACKEND_URL']='\${BACKEND_URL}';`);
    expect(result).toContain(`window.env['FOO']='\${FOO}';`);
    expect(result).toMatchSnapshot();
  });

  it('creates an env-config that does not set any variables', () => {
    // when
    const result = createEnvConfigContent([], true);

    // then
    expect(result).toMatchSnapshot();
  });
});

describe('envConfig', () => {
  const FIXTURES_PATH = path.join(__dirname, 'fixtures');

  describe('devServer', () => {
    let server: ViteDevServer;
    const env = process.env;

    beforeEach(() => {
      process.env = { ...env };
    });

    afterEach(async () => {
      process.env = env;
      await server.close();
    });

    it('serves /index.html that includes envConfig.js script', async () => {
      expect.assertions(2);

      // given
      server = await createServer({
        root: FIXTURES_PATH,
        plugins: [envConfig()],
      });

      // when
      const response = await request(server.middlewares).get('/index.html');

      // then
      expect(response.status).toBe(200);
      expect(response.text).toContain('<script src="/env-config.js"></script>');
    });

    it('serves /env-config.js', async () => {
      expect.assertions(2);

      // given
      const variables = ['BACKEND_URL'];
      process.env.BACKEND_URL = 'http://localhost:4000';

      server = await createServer({
        root: FIXTURES_PATH,
        plugins: [envConfig({ variables })],
      });

      // when
      const response = await request(server.middlewares).get('/env-config.js');

      // then
      expect(response.status).toBe(200);
      expect(response.text).toContain(`window.env['BACKEND_URL']='${process.env.BACKEND_URL}';`);
    });
  });

  describe('build', () => {
    beforeEach(() => {
      const distPath = path.join(FIXTURES_PATH, 'dist');
      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true });
      }
    });

    it('modifies index.html to include envConfig.js script', async () => {
      expect.assertions(1);

      // when
      await build({
        logLevel: 'silent',
        root: FIXTURES_PATH,
        plugins: [envConfig()],
      });
      const indexHtml = await readFile(path.join(FIXTURES_PATH, 'dist/index.html'));

      // then
      expect(indexHtml.toString()).toContain('<script src="/env-config.js"></script>');
    });

    it('creates env-config.template.js containing variables and placeholders', async () => {
      expect.assertions(1);

      // given
      const variables = ['BACKEND_URL'];

      // when
      await build({
        logLevel: 'silent',
        root: FIXTURES_PATH,
        plugins: [envConfig({ variables })],
      });
      const envConfigTemplate = await readFile(path.join(FIXTURES_PATH, 'dist/env-config.template.js'));

      // then
      expect(envConfigTemplate.toString()).toContain(`window.env['BACKEND_URL']='\${BACKEND_URL}';`);
    });
  });
});
