# vite-plugin-copy2

> The most simple and easy-to-use vite copy plugin.

use like [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/)

If you are migrating from webpack to vite and looking for an copy plugin, this plugin will be very suitable for you.

Compare the usage of `copy-webpack-plugin` and `vite-plugin-copy2`:

```js
// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        // copy dir
        { from: 'src/assets', to: 'assets' },
        // copy file
        { from: 'src/constants/config.json', to: 'config.json' }
      ]
    })
  ]
}
```

```js
// vite.config.ts
import { copy } from 'vite-plugin-copy2'

export default defineConfig({
  plugins: [
    copy({
      pattern: [
        // copy dir
        { from: 'src/assets', to: 'assets' },
        // copy file
        { from: 'src/constants/config.json', to: 'config.json' }
      ]
    })
  ]
})
```

## Install

```bash
# npm
npm i vite-plugin-copy2 -D

# yarn
yarn add vite-plugin-copy2 -D

# pnpm
pnpm add vite-plugin-copy2 -D
```
