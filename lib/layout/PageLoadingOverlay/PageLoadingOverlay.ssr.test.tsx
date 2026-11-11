import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';

import { localization } from '../../utils/constants';
import { PageLoadingOverlay } from './PageLoadingOverlay';

it('renders the loading status during SSR and no markup when inactive', () => {
    const html = renderToString(<PageLoadingOverlay active />);

    expect(html).toContain('role="status"');
    expect(html).toContain(localization.loading);
    expect(renderToString(<PageLoadingOverlay active={false} />)).toBe('');
});
