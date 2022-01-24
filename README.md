# @geprog/vite-plugin-env-config

Vite plugin for providing configurations from environment variables at runtime.

## Usage

Add `envConfig` plugin to `vite.config.js / vite.config.ts`:

```js
// vite.config.js / vite.config.ts
import { envConfig } from '@geprog/vite-plugin-env-config';

export default {
  plugins: [envConfig()],
};
```

Add a template file to your project at `./src/assets/env-config.template.js`:

```js
// ./src/assets/env-config.template.js
(function (window) {
  window.env = window.env || {};

  // add a line for each environment variable
  window['env']['BACKEND_URL'] = '${BACKEND_URL}';
})(this);
```

Include `/assets/env-config.js` in your `index.html`:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="/assets/env-config.js"></script>
  </head>
</html>
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
CMD ["/bin/sh", "-c", "envsubst < ./src/assets/env-config.template.js > ./dist/assets/env-config.js && exec nginx -g 'daemon off;'"]
```

`@geprog/vite-plugin-env-config` provides the same functionality for your development environment.
