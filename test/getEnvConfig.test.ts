/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { EnvConfig, getEnvConfig } from '~/getEnvConfig';

describe('getEnvConfig', () => {
  const env = process.env;

  beforeEach(() => {
    delete (window as unknown as { env?: EnvConfig }).env;
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should get a config value from window.env', () => {
    // given
    const config: EnvConfig = {
      BACKEND_URL: 'http://localhost:4000/window',
    };
    (window as unknown as { env?: EnvConfig }).env = config;

    // when
    const configBackendUrl = getEnvConfig('BACKEND_URL');

    // then
    expect(configBackendUrl).toStrictEqual(config.BACKEND_URL);
  });

  it('should get a config value from process.env', () => {
    // given
    process.env.BACKEND_URL = 'http://localhost:4000/process';

    // when
    const configBackendUrl = getEnvConfig('BACKEND_URL');

    // then
    expect(configBackendUrl).toStrictEqual(process.env.BACKEND_URL);
  });

  it('should return undefined when a config value is not set', () => {
    // when
    const configBackendUrl = getEnvConfig('BACKEND_URL');

    // then
    expect(configBackendUrl).toBeUndefined();
  });
});
