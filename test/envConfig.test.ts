import { createEnvConfigContent } from '~/envConfig';

describe('createEnvConfigContent', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
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
