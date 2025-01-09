import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import vercel from 'vite-plugin-vercel';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import removeConsole from 'vite-plugin-remove-console';
// import type { ViteSentryPluginOptions } from 'vite-plugin-sentry';
// import viteSentry from 'vite-plugin-sentry';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // const sentryConfig: ViteSentryPluginOptions = {
  //   url: 'https://sentry.io',
  //   authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
  //   org: 'gokudos',
  //   project: 'gokudos',
  //   release: '1.0',
  //   deploy: {
  //     env: process.env.VITE_GK_ENVIRONMENT,
  //   },
  //   setCommits: {
  //     auto: true,
  //   },
  //   sourceMaps: {
  //     include: ['./dist/assets'],
  //     ignore: ['node_modules'],
  //     urlPrefix: '~/assets',
  //   },
  //   silent: process.env.VITE_GK_ENVIRONMENT === 'development',
  // };

  const pwaOptions: Partial<VitePWAOptions> = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    base: '/',
    includeAssets: ['favicon.ico'],
    manifest: {
      name: 'GoKudos',
      short_name: 'GoKudos',
      description:
        'GoKudos Workspace on Cloud | All your business needs in one platform',
      theme_color: '#d6001c',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  };

  return defineConfig({
    plugins: [
      vercel(),
      react(),
      tsconfigPaths(),
      // viteSentry(sentryConfig),
      VitePWA(pwaOptions),
      removeConsole(),
    ],
    build: {
      sourcemap: true,
    },
    // @ts-ignore
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-utils/setupTests.ts',
    },
  });
};
