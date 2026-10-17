// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from '@eslint/js';
import path from 'node:path';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import storybook from 'eslint-plugin-storybook';
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    eslintPluginTailwindcss.configs['flat/recommended'] || eslintPluginTailwindcss.configs.recommended,
    {
        settings: {
            // Define the tailwindcss settings with the MANDATORY `cssConfigPath`
            tailwindcss: {
                cssConfigPath: path.resolve(import.meta.dirname, 'lib/theme.css')
            }
        },
        rules: {
            'tailwindcss/no-custom-classname': [
                'error',
                {
                    whitelist: ['tope-ui-.*']
                }
            ],
            'tailwindcss/no-unnecessary-arbitrary-value': 'off'
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            storybook.configs['flat/recommended']
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        }
    }
]);
