import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';

import { useAppForm } from '../../hooks/form';

const SelectedForm = () => {
    const form = useAppForm({ defaultValues: { selection: ['apple', 'pear'] } });
    return (
        <form.AppField name='selection'>
            {(field) => (
                <field.Select
                    label='Fruit'
                    multiple
                    options={[
                        { value: 'apple', label: 'Apple' },
                        { value: 'pear', label: 'Pear' }
                    ]}
                />
            )}
        </form.AppField>
    );
};

it('renders selected tags on the server without browser APIs', () => {
    expect(typeof document).toBe('undefined');
    const html = renderToString(<SelectedForm />);
    expect(html).toContain('Apple');
    expect(html).toContain('Pear');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('<select');
});
