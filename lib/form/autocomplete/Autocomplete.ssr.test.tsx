import { expect, test } from 'vitest';
import { renderToString } from 'react-dom/server';

import { useAppForm } from '../../hooks/form';
import { Modal } from '../../general/modal';

const Examples = () => {
    const form = useAppForm({ defaultValues: { first: '', second: '' } });
    const props = {
        onSearch: async () => ({ options: [], page: 0, hasNextPage: false }),
        onFetch: async () => null
    };

    return (
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
            <form.AppField name='first'>
                {(field) => (
                    <field.Autocomplete
                        {...props}
                        label='First'
                    />
                )}
            </form.AppField>
            <form.AppField name='second'>
                {(field) => (
                    <field.Autocomplete
                        {...props}
                        label='Second'
                    />
                )}
            </form.AppField>
        </>
    );
};

test('Modal and Autocomplete render independent, deterministic relationships without browser globals', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(<Examples />);
    expect(renderToString(<Examples />)).toBe(html);
    const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), (match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    const relationships = Array.from(html.matchAll(/ aria-(?:labelledby|controls)="([^"]+)"/g), (match) => match[1]);
    expect(relationships).toHaveLength(6);
    for (const id of relationships) expect(ids).toContain(id);
    expect(html).not.toContain('aria-describedby');
});
