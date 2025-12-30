import type { Preview } from '@storybook/react-vite';
import '../lib/main.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        a11y: {
            context: 'body',
            config: {},
            options: {}
        }
    },
    tags: ['autodocs']
};

export default preview;
