import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    esbuild: {
        jsx: 'transform',
        jsxInject: `import { h } from '@/lib/jsx/jsx-runtime';`,
        jsxFactory: 'h',
    },
});
