import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/app/api/auth/*',
        'src/app/api/trpc/*',
        'src/app/layout.tsx',
        'src/components/ui/*',
        'src/generated/*',
        'src/trpc/*',
        'src/lib/auth.ts',
        'src/lib/auth-client.ts',
        'src/lib/db.ts',
      ],
      reporter: ['text'],
      // thresholds: {
      //   lines: 90,
      //   functions: 90,
      // },
    },
  },
});
