export interface EnvConfig {
  [key: string]: string;
}

export function getEnvConfig<T extends keyof EnvConfig>(key: keyof EnvConfig): EnvConfig[T] | undefined {
  const { env } = window as unknown as { env: EnvConfig };
  const config = env || {};

  return config[key];
}
