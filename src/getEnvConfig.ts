export interface EnvConfig {
  [key: string]: string;
}

export function getEnvConfig<T extends keyof EnvConfig>(key: keyof EnvConfig): EnvConfig[T] | undefined {
  const _window = global.window as unknown as { env?: EnvConfig };
  if (_window?.env) {
    return _window.env[key];
  }
  if (global.process?.env) {
    return global.process.env[key];
  }
}
