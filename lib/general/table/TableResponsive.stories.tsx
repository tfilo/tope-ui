import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Table } from './Table';
import { createColumns } from './table-utils';

type RecordRow = { fuel: string; quantity: string; price: string; date: string; odometer: string; status: string; consumption: string };

const records: RecordRow[] = [
    {
        fuel: 'Benzín',
        quantity: '40 L',
        price: '64,80 €',
        date: '10.11.2026, 18:30',
        odometer: '12 450 km',
        status: 'Plná nádrž',
        consumption: '6,2 L/100 km'
    },
    {
        fuel: 'Nabíjanie',
        quantity: '24 kWh',
        price: '8,40 €',
        date: '08.11.2026, 20:15',
        odometer: '12 310 km',
        status: 'Plné nabitie',
        consumption: '—'
    },
    {
        fuel: 'Benzín',
        quantity: '32 L',
        price: '51,84 €',
        date: '03.11.2026, 17:45',
        odometer: '12 090 km',
        status: 'Plná nádrž',
        consumption: '6,4 L/100 km'
    }
];
async function fetchRecords(page: number, pageSize: number) {
    return { data: records.slice(page * pageSize, (page + 1) * pageSize), page, pageSize, totalRecords: records.length };
}

const openDetail = fn();
const editRecord = fn();
const deleteRecord = fn();

const columns = createColumns<RecordRow>([
    { header: 'Dátum a čas', accessor: 'date' },
    { header: 'Palivo', accessor: 'fuel' },
    { header: 'Stav kilometrov', accessor: 'odometer' },
    { header: 'Množstvo', accessor: 'quantity' },
    { header: 'Spolu', accessor: 'price' },
    { header: 'Spotreba', accessor: 'consumption' },
    {
        header: 'Akcie',
        accessor: 'status',
        cell: (row) => (
            <div className='flex gap-sm'>
                <Button
                    icon={PencilIcon}
                    showChildren={false}
                    variant='transparent'
                    onClick={() => editRecord(row)}
                >
                    Upraviť
                </Button>
                <Button
                    icon={TrashIcon}
                    showChildren={false}
                    variant='danger'
                    onClick={() => deleteRecord(row)}
                >
                    Odstrániť
                </Button>
            </div>
        )
    }
]);

const meta = { title: 'General/Table/Responsive rows', component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FuelRecords: Story = {
    args: { columns: [], data: [] },
    render: () => (
        <div className='mx-auto w-full max-w-[1100px] p-lg'>
            <h1 className='mb-lg text-headline-3 font-bold'>Tankovanie a nabíjanie</h1>
            <p className='mb-lg text-sm text-secondary'>Kliknutím na záznam otvoríte detail.</p>
            <Table<RecordRow>
                columns={columns}
                onFetch={fetchRecords}
                onRowClick={openDetail}
                renderMobileRow={(row) => (
                    <div className='flex items-start justify-between gap-md'>
                        <div className='min-w-none flex-1'>
                            <div className='flex justify-between gap-md font-bold'>
                                <span>
                                    {row.fuel} · {row.quantity}
                                </span>
                                <span className='whitespace-nowrap'>{row.price}</span>
                            </div>
                            <p className='mt-sm text-sm text-secondary'>{row.date}</p>
                            <p className='text-sm'>
                                {row.odometer} · {row.status}
                            </p>
                            {row.consumption !== '—' && <p className='text-sm text-secondary'>Spotreba: {row.consumption}</p>}
                        </div>
                        <div className='shrink-0'>
                            <Dropdown
                                showChevron={false}
                                buttonProps={{ variant: 'transparent', 'aria-label': 'Akcie záznamu' }}
                                options={[
                                    { label: 'Upraviť', icon: PencilIcon, onClick: () => editRecord(row) },
                                    { label: 'Odstrániť', icon: TrashIcon, onClick: () => deleteRecord(row) }
                                ]}
                            >
                                ⋮
                            </Dropdown>
                        </div>
                    </div>
                )}
            />
        </div>
    ),
    play: async ({ canvas, userEvent }) => {
        openDetail.mockClear();
        editRecord.mockClear();
        const row = (await canvas.findAllByText('12 450 km')).find((element) => element.checkVisibility())!;
        await userEvent.click(row);
        await expect(openDetail).toHaveBeenCalledTimes(1);
        const container = row.closest('tr, li')! as HTMLElement;
        container.focus();
        await userEvent.keyboard('{Enter}');
        await expect(openDetail).toHaveBeenCalledTimes(2);
        const edit = canvas.queryAllByRole('button', { name: 'Upraviť' });
        if (edit.length) {
            await userEvent.click(edit[0]);
        } else {
            const trigger = canvas.getAllByRole('button', { name: 'Akcie záznamu' })[0];
            await expect(trigger.querySelector('svg')).toBeNull();
            await userEvent.click(trigger);
            await userEvent.click(canvas.getByRole('button', { name: 'Upraviť' }));
        }
        await expect(editRecord).toHaveBeenCalledTimes(1);
        await expect(openDetail).toHaveBeenCalledTimes(2);
    }
};
