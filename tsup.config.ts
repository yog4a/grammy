import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/core.ts',
        'src/helpers.ts',
        'src/packages/menu.ts',
        'src/packages/auto-retry.ts',
        'src/packages/chat-members.ts',
        'src/packages/conversations.ts',
        'src/packages/parse-mode.ts',
        'src/packages/ratelimiter.ts',
        'src/packages/runner.ts',
        'src/packages/stateless-question.ts',
        'src/packages/transformer-throttler.ts',
        'src/packages/types.ts',
        'src/packages/grammy.ts',
    ],
    format: ['cjs', 'esm'],        // ✅ both outputs
    target: 'es2022',              // better for Node 18+ than esnext
    outDir: 'dist',
    clean: true,
    dts: true,
    sourcemap: false,
    splitting: false,              // ✅ keep single-file builds
    keepNames: true,               // ✅ preserve names
    external: ['dotenv'],          // ✅ leave externals
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.mjs'
        }
    },
});
