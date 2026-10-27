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
