import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-vitest', '@storybook/addon-a11y'],
    framework: '@storybook/react-vite',
    docs: {
        defaultName: 'Documentation',
        docsMode: false
    }
};
export default config;
