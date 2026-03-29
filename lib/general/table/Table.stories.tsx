import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from './Table';
import { Button } from '../button';
import { PencilIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

const meta = {
    title: 'General/Table',
    component: Table,
    tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
    render: ({ columns, data }) => {
        const [sort, setSort] = useState<'asc' | 'desc' | null>(null);

        const newColumns = [...columns];

        const nameColumn = newColumns.find((col) => col.accessor === 'name');

        if (nameColumn) {
            nameColumn.onSort = (accessor, direction) => {
                setSort(direction);
            };
            nameColumn.sortDirection = sort;
        }

        return (
            <Table
                data={data}
                columns={columns}
            />
        );
    },
    args: {
        columns: [
            { header: 'Name', accessor: 'name' },
            { header: 'Age', accessor: 'age' },
            { header: 'City', accessor: 'city' },
            { header: 'Description', accessor: 'description', additionalClassName: 'min-w-[300px]' },
            {
                header: 'Action',
                accessor: 'name',
                additionalClassName: 'min-w-[100px] border-l text-right',
                cell: () => (
                    <Button
                        icon={PencilIcon}
                        additionalClassName='inline-flex min-w-[32px] min-h-[32px]'
                        showChildren={false}
                        variant='transparent'
                    >
                        Detail
                    </Button>
                )
            }
        ],
        data: [
            {
                name: 'Alice',
                age: 30,
                city: 'New York',
                description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet quibusdam ducimus adipisci, sequi eius voluptatibus excepturi sunt ipsum ullam nobis.'
            },
            { name: 'Bob', age: 25, city: 'Los Angeles', description: 'Designer' },
            { name: 'Charlie', age: 35, city: 'Chicago', description: 'Manager' }
        ]
    }
};
