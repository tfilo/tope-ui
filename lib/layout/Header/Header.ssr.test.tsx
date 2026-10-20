import { expect, test } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MapIcon } from '@heroicons/react/16/solid';

import { Header } from './Header';

test('Header renders on the server without window using the desktop fallback', () => {
    expect(typeof window).toBe('undefined');

    const html = renderToString(<Header menu={[{ label: 'Map', icon: MapIcon, onClick: () => {} }]} />);

    expect(html).toContain('<header');
    expect(html).toContain('Map</button>');
});
