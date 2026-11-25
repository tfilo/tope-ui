import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';

import { localization } from '../../utils/constants';
import { LoadingOverlay } from './LoadingOverlay';

it('renders the loading status during SSR and no markup when inactive', () => {
    const html = renderToString(<LoadingOverlay active />);

    expect(html).toContain('role="status"');
    expect(html).toContain(localization.loading);
    expect(renderToString(<LoadingOverlay active={false} />)).toBe('');
});
