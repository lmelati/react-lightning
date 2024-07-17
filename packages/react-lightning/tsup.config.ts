import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  target: 'es2015',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  external: ['react'],
  sourcemap: true,
});
