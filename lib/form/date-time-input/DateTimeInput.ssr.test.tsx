import { expect, test } from 'vitest';
import { renderToString } from 'react-dom/server';

import { useAppForm } from '../../hooks/form';

const SlotExample = ({ interval }: { interval?: number }) => {
    const form = useAppForm({ defaultValues: { date: '' } });

    return (
        <form.AppField name='date'>
            {(field) => (
                <field.DateTimeInput
                    type='dateTime'
                    label='Appointment'
                    slots={interval}
                />
            )}
        </form.AppField>
    );
};

test.each([
    [undefined, 96, '23:45'],
    [1, 1440, '23:59'],
    [7, 206, '23:55'],
    [15, 96, '23:45'],
    [30, 48, '23:30'],
    [60, 24, '23:00'],
    [180, 8, '21:00'],
    [1440, 1, '00:00'],
    [1441, 1, '00:00'],
    [Number.MAX_VALUE, 1, '00:00']
] as const)('slots=%s generates %s ordered times ending at %s', (interval, count, last) => {
    const html = renderToString(<SlotExample interval={interval} />);
    const labels = Array.from(html.matchAll(/>(\d{2}:\d{2})<\/button>/g), (match) => match[1]);
    expect(labels).toHaveLength(count);
    expect(labels[0]).toBe('00:00');
    expect(labels.at(-1)).toBe(last);
    const minutes = labels.map((label) => {
        const [hour, minute] = label.split(':').map(Number);
        expect(hour).toBeLessThan(24);
        expect(minute).toBeLessThan(60);

        return hour * 60 + minute;
    });
    for (let index = 1; index < minutes.length; index++) {
        expect(minutes[index]).toBeGreaterThan(minutes[index - 1]);
        expect(minutes[index] - minutes[index - 1]).toBe(interval ?? 15);
    }
});

test('slots=0 disables generated slots', () => {
    expect(renderToString(<SlotExample interval={0} />)).not.toMatch(/>\d{2}:\d{2}<\/button>/);
});

// Invalid configurations are tested on the server after adding the guard, never in the browser render loop.
test.each([-15, -1, NaN, Infinity, -Infinity, 0.5, Number.MIN_VALUE])('slots=%s throws a clear RangeError', (interval) => {
    expect(() => renderToString(<SlotExample interval={interval} />)).toThrowError(
        new RangeError('DateTimeInput slots must be 0 or a positive finite whole number of minutes.')
    );
});
