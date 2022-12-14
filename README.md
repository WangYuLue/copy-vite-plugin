# copy-vite-plugin

> The most simple and easy-to-use vite copy plugin.

use like [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/)

If you are migrating from webpack to vite and looking for an copy plugin, this plugin will be very suitable for you.

Compare the usage of `copy-webpack-plugin` and `copy-vite-plugin`:

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
import { copy } from 'copy-vite-plugin'

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
npm i copy-vite-plugin -D

# yarn
yarn add copy-vite-plugin -D

# pnpm
pnpm add copy-vite-plugin -D
```
