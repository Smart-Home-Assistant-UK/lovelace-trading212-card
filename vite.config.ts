import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'InvestmentCard',
      fileName: 'investment-card',
      formats: ['es'],
    },
    target: 'es2020',
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  test: {
    environment: 'node',
  },
});
