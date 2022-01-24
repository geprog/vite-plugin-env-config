import { EnvConfig, getEnvConfig } from '~/getEnvConfig';

describe('getEnvConfig', () => {
  beforeEach(() => {
    jest.resetModules();
    delete (window as unknown as { env?: EnvConfig }).env;
  });

  it('should get a config value from window.env', () => {
    // given
    const config: EnvConfig = {
      BACKEND_URL: 'http://localhost:4000',
    };
    (window as unknown as { env?: EnvConfig }).env = config;

    // when
    const configBackendUrl = getEnvConfig('BACKEND_URL');

    // then
    expect(configBackendUrl).toStrictEqual(config.BACKEND_URL);
  });

  it('should return undefined when a config value is not set', () => {
    // when
    const configBackendUrl = getEnvConfig('BACKEND_URL');

    // then
    expect(configBackendUrl).toBeUndefined();
  });
});
