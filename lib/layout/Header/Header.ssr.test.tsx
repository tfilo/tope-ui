import { expect, test } from 'vitest';
import { renderToString } from 'react-dom/server';

import { Header } from './Header';

test('Header renders on the server without window using the desktop fallback', () => {
    expect(typeof window).toBe('undefined');

    const html = renderToString(<Header menu={[{ label: 'Map', onClick: () => {} }]} />);

    expect(html).toContain('<header');
    expect(html).toContain('Map</button>');
});
