/// <reference types="vitest/config" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __dirname = dirname(fileURLToPath(import.meta.url));
const dirname_value = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [tailwindcss(), react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'TOPE-UI',
            // the proper extensions will be added
            fileName: (format, entryName) => `tope-ui-${entryName}.${format}.js`,
            formats: ['es', 'umd']
        },
        license: true,
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React'
                }
            }
        }
    },
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(dirname_value, '.storybook')
                    })
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [
                            {
                                browser: 'chromium'
                            }
                        ]
                    },
                    setupFiles: ['.storybook/vitest.setup.ts']
                }
            }
        ]
    }
});
