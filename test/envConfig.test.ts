import { renderTemplateWithEnvVars } from '~/envConfig';

describe('renderTemplateWithEnvVars', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should replace ${BACKEND_URL} with the respective environment variable', () => {
    // given
    const envConfigTemplate = `
    (function (window) {
      window.env = window.env || {};
    
      // Environment variables
      window['env']['BACKEND_URL'] = '\${BACKEND_URL}';
    })(this);
    `;
    process.env.BACKEND_URL = 'http://localhost:4000';

    // when
    const result = renderTemplateWithEnvVars(envConfigTemplate);

    // then
    expect(result).toBe(envConfigTemplate.replace('${BACKEND_URL}', 'http://localhost:4000'));
  });

  it('should replace ${BACKEND_URL} with an empty string when the respective environment variable is not set', () => {
    // given
    const envConfigTemplate = `
    (function (window) {
      window.env = window.env || {};
    
      // Environment variables
      window['env']['BACKEND_URL'] = '\${BACKEND_URL}';
    })(this);
    `;

    // when
    const result = renderTemplateWithEnvVars(envConfigTemplate);

    // then
    expect(result).toBe(envConfigTemplate.replace('${BACKEND_URL}', ''));
  });
});
