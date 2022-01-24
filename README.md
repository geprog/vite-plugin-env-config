# @geprog/vite-plugin-env-config

Vite plugin for providing configurations from environment variables at runtime.

The generated template can be populated with [envsubst](https://github.com/a8m/envsubst) in production.

## Usage

Add `envConfig` plugin to `vite.config.js / vite.config.ts` and provide a list of environment variable names:

```js
// vite.config.js / vite.config.ts
import { envConfig } from '@geprog/vite-plugin-env-config';

export default {
  plugins: [envConfig({ variables: ['BACKEND_URL'] })],
};
```

To access the environment variables use the built-in getter:

```ts
import { getEnvConfig } from '@geprog/vite-plugin-env-config';

const backendURL = getEnvConfig('BACKEND_URL');
```

For production use `envsubst` as outlined in the [next section](#motivation).

## Motivation

To adhere to the principles of the [twelve-factor app](https://12factor.net/config)
you might need to access environment variables that are set when your frontend server starts.
Instead of building your frontend on startup,
you can use a config template like the one above and populate it using `envsubst`:

```Dockerfile
CMD ["/bin/sh", "-c", "envsubst < ./dist/assets/env-config.template.js > ./dist/assets/env-config.js && exec nginx -g 'daemon off;'"]
```

`@geprog/vite-plugin-env-config` generates the required template from a list of variable names and provides the already populated file during development.
