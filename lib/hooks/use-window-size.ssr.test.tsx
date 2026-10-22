// useWindowSize.ssr.test.tsx
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { useWindowSize } from './use-window-size';

const TestComponent = () => {
    const windowSize = useWindowSize();

    return createElement('span', null, windowSize);
};

describe('useWindowSize SSR', () => {
    it('returns desktop without accessing window', () => {
        expect(typeof window).toBe('undefined');

        const html = renderToString(createElement(TestComponent));

        expect(html).toBe('<span>desktop</span>');
    });
});
