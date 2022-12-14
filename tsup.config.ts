import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts'
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  clean: true
})
