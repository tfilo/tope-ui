import { renderToString } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';

import { useAppForm } from '../../hooks/form';

const originalTimezone = process.env.TZ;
afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
});

const DateForm = ({ value, type = 'dateTime' }: { value: string; type?: 'date' | 'dateTime' }) => {
    const form = useAppForm({ defaultValues: { date: value } });
    return (
        <form.AppField name='date'>
            {(field) => (
                <field.DateTimeInput
                    type={type}
                    inputFormat={[type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss']}
                />
            )}
        </form.AppField>
    );
};

it('renders identical initial markup across server timezones, including DST gaps and empty values', () => {
    for (const value of ['2026-01-31T23:30:00', '2026-03-29T02:30:00', '']) {
        process.env.TZ = 'UTC';
        const utc = renderToString(<DateForm value={value} />);
        process.env.TZ = 'Europe/Bratislava';
        const bratislava = renderToString(<DateForm value={value} />);
        expect(bratislava).toBe(utc);
        expect(utc).toContain(`value="${value.replace('T', ' ')}"`);
    }
});

it('rejects absolute timestamps and noncanonical or impossible calendar values', () => {
    for (const value of ['2026-01-31T23:30:00Z', '2026-01-31T23:30:00+01:00', '2026-01-31T23:30', '2026-02-30T12:00:00']) {
        expect(renderToString(<DateForm value={value} />)).toContain('value=""');
    }
    expect(
        renderToString(
            <DateForm
                value='2026-01-31'
                type='date'
            />
        )
    ).toContain('value="2026-01-31"');
    expect(
        renderToString(
            <DateForm
                value='2026-01-31T23:30:00'
                type='date'
            />
        )
    ).toContain('value=""');
});
