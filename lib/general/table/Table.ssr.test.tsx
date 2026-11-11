import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';

import { Table } from './Table';
import { createColumns } from './table-utils';

it('renders supplied rows in default sort order during SSR', () => {
    const columns = createColumns<{ name: string }>([{ header: 'Name', accessor: 'name', sortable: true, defaultSortDirection: 'asc' }]);
    const data = [{ name: 'Bob' }, { name: 'Alice' }];

    const html = renderToString(
        <Table
            columns={columns}
            data={data}
        />
    );

    expect(html).toContain('>Alice</td>');
    expect(html).toContain('>Bob</td>');
    expect(html.indexOf('>Alice</td>')).toBeLessThan(html.indexOf('>Bob</td>'));
    expect(data.map((row) => row.name)).toEqual(['Bob', 'Alice']);
});

it('renders both responsive layouts without browser APIs or invoking row navigation', () => {
    let opened = false;
    const html = renderToString(
        <Table
            columns={createColumns<{ name: string }>([{ header: 'Name', accessor: 'name' }])}
            data={[{ name: 'Synthetic record' }]}
            onRowClick={() => {
                opened = true;
            }}
            renderMobileRow={(row) => <strong>{row.name}</strong>}
        />
    );

    expect(html).toContain('tablet:table');
    expect(html).toContain('tablet:hidden');
    expect(html).toContain('<strong>Synthetic record</strong>');
    expect(opened).toBe(false);
});
