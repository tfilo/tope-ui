import { expect, test } from 'vitest';
import { renderToString } from 'react-dom/server';

import { Modal } from './Modal';

const Examples = () => (
    <>
        <Modal
            title='First dialog'
            body={<p>Complex content</p>}
            openModal={false}
        />
        <Modal
            title='Second dialog'
            body='Simple content'
            openModal={false}
        />
    </>
);

test('Modal renders independent, deterministic title relationships without browser globals', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(<Examples />);
    expect(renderToString(<Examples />)).toBe(html);
    const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), (match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    const relationships = Array.from(html.matchAll(/ aria-labelledby="([^"]+)"/g), (match) => match[1]);
    expect(relationships).toHaveLength(2);
    for (const id of relationships) expect(ids).toContain(id);
    expect(html).not.toContain('aria-describedby');
});
