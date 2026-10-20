import { act as reactAct } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon } from '@heroicons/react/16/solid';

import { Button } from '../button';
import { Table } from './Table';
import { type SortObject } from './Table.types';
import { createColumns } from './table-utils';
import { localization } from '../../utils/constants';

const meta = {
    title: 'General/Table',
    component: Table,
    tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

type DataObject = {
    name: string;
    age: number;
    city: string;
    description: string;
};

const columns = createColumns<DataObject>([
    { header: 'Name', accessor: 'name', additionalClassName: 'min-w-[150px]', sortable: true, defaultSortDirection: 'asc' },
    {
        header: 'Age',
        accessor: 'age',
        additionalClassName: 'min-w-[100px]',
        sortable: true,
        compare: (a, b) => {
            const valueA = +(a ?? 0);
            const valueB = +(b ?? 0);

            return valueA - valueB;
        }
    },
    { header: 'City', accessor: 'city', additionalClassName: 'min-w-[200px]', sortable: true },
    { header: 'Description', accessor: 'description', additionalClassName: 'min-w-[1000px]' },
    {
        header: 'Action',
        accessor: 'name',
        additionalClassName: 'min-w-[100px] border-l text-right sticky right-none bg-white shadow-lg shadow-secondary-light',
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
]);

const data: DataObject[] = [
    { name: 'Bob', age: 25, city: 'Los Angeles', description: 'Designer' },
    {
        name: 'Alice',
        age: 30,
        city: 'New York',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis voluptatum voluptate quam optio cumque voluptatibus architecto maxime, placeat sequi inventore eveniet atque fuga culpa autem quae error. Odio voluptatibus vitae, sint iure minima cum porro eligendi omnis nemo, ipsam nam ipsa inventore sapiente consequuntur assumenda consequatur culpa harum a quidem est libero nesciunt. Architecto quod aut iusto assumenda suscipit quibusdam nobis modi ullam aspernatur exercitationem.'
    },
    { name: 'Charlie', age: 35, city: 'Chicago', description: 'Manager' },
    { name: 'Diana', age: 28, city: 'Miami', description: 'Frontend Developer with a passion for clean UI and responsive design systems.' },
    { name: 'Ethan', age: 12, city: 'Seattle', description: 'Cloud Architect specializing in AWS and distributed systems infrastructure.' },
    { name: 'Fiona', age: 1, city: 'Austin', description: 'Data Scientist focusing on machine learning models for predictive analytics.' },
    {
        name: 'George',
        age: 24,
        city: 'San Francisco',
        description: 'Junior Software Engineer currently learning Go and Kubernetes internals.'
    },
    {
        name: 'Hannah',
        age: 29,
        city: 'Boston',
        description: 'Product Manager who loves bridging the gap between technical teams and end users.'
    },
    { name: 'Ian', age: 33, city: 'Denver', description: 'Outdoor enthusiast and full-stack developer working on environmental apps.' },
    {
        name: 'Julia',
        age: 27,
        city: 'Portland',
        description: 'UX Researcher dedicated to improving accessibility standards across the web.'
    },
    {
        name: 'Kevin',
        age: 45,
        city: 'Atlanta',
        description: 'Senior DevOps Lead with extensive experience in CI/CD pipelines and security.'
    },
    { name: 'Laura', age: 2, city: 'San Diego', description: 'Content Strategist and technical writer for various open-source projects.' },
    { name: 'Mike', age: 38, city: 'Houston', description: 'Backend Engineer proficient in Python, Django, and PostgreSQL optimization.' },
    { name: 'Nina', age: 30, city: 'Phoenix', description: 'Graphic Designer transitioning into motion graphics and 3D modeling.' },
    { name: 'Oscar', age: 22, city: 'Philadelphia', description: 'Computer Science student and intern at a local fintech startup.' },
    {
        name: 'Paula',
        age: 34,
        city: 'Las Vegas',
        description: 'Event Coordinator leveraging technology to streamline large-scale conferences.'
    },
    {
        name: 'Quinn',
        age: 29,
        city: 'Detroit',
        description: 'Cybersecurity Analyst monitoring network traffic for potential vulnerabilities.'
    },
    {
        name: 'Ryan',
        age: 41,
        city: 'Minneapolis',
        description: 'Mobile App Developer focused on React Native and cross-platform performance.'
    },
    {
        name: 'Sophia',
        age: 25,
        city: 'Salt Lake City',
        description: 'QA Automation Engineer writing robust test suites for e-commerce platforms.'
    },
    { name: 'Thomas', age: 37, city: 'Charlotte', description: 'Database Administrator managing high-availability clusters and backups.' },
    { name: 'Ursula', age: 32, city: 'New Orleans', description: 'Creative Director leading a team of multi-disciplinary visual artists.' },
    {
        name: 'Victor',
        age: 28,
        city: 'Nashville',
        description: 'Sales Engineer providing technical demonstrations for enterprise software.'
    },
    { name: 'Wendy', age: 36, city: 'Orlando', description: 'Marketing Analyst using data visualization to track campaign performance.' },
    {
        name: 'Xavier',
        age: 23,
        city: 'Baltimore',
        description: 'System Administrator maintaining local server fleets and user workstations.'
    },
    { name: 'Yara', age: 30, city: 'San Jose', description: 'Hardware Engineer working on the next generation of IoT devices.' }
] as const;

const fetchMethod = async (page: number, pageSize: number, sort: SortObject<DataObject>[]) => {
    const sortedData =
        sort.length === 0
            ? data
            : [...data].sort((rowA, rowB) => {
                  const _sort = [...sort];
                  let sortResult = 0;
                  let s: SortObject<DataObject> | undefined;
                  do {
                      s = _sort.shift();
                      if (s) {
                          const valueA = `${rowA[s.accessor]}`;
                          const valueB = `${rowB[s.accessor]}`;

                          if (s.direction === 'asc') {
                              sortResult = valueA.localeCompare(valueB, 'sk-SK', {
                                  sensitivity: 'base'
                              });
                          } else {
                              sortResult = valueB.localeCompare(valueA, 'sk-SK', {
                                  sensitivity: 'base'
                              });
                          }
                      }
                  } while (sortResult === 0 && s !== undefined);
                  return sortResult;
              });

    const pagedData = [...sortedData].slice(page * pageSize, page * pageSize + pageSize);

    return {
        data: pagedData,
        page: page,
        pageSize: pageSize,
        totalRecords: data.length
    };
};

export const StaticData: Story = {
    play: async ({ canvas, userEvent }) => {
        const sortByNameBtn = canvas.getByTitle('Name', {
            exact: false
        });
        const sortByAgeBtn = canvas.getByTitle('Age', {
            exact: false
        });
        const sortByCityBtn = canvas.getByTitle('City', {
            exact: false
        });

        const table = canvas.getByRole('table');

        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Alice');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Yara');

        await expect(sortByNameBtn.tagName).toBe('BUTTON');
        await expect(sortByAgeBtn.tagName).toBe('BUTTON');
        await expect(sortByCityBtn.tagName).toBe('BUTTON');

        await expect(sortByNameBtn.title).toContain('Zoradiť vzostupne');
        await expect(sortByAgeBtn.title).toContain('Nezoradené');
        await expect(sortByCityBtn.title).toContain('Nezoradené');

        await userEvent.click(sortByNameBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByNameBtn.title).toContain('Zoradiť zostupne');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Yara');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Alice');

        await userEvent.click(sortByNameBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByNameBtn.title).toContain('Nezoradené');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Bob');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Yara');

        await userEvent.click(sortByAgeBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByAgeBtn.title).toContain('Zoradiť vzostupne');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Fiona');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Kevin');
        await expect(table.lastElementChild?.childNodes.item(6)?.childNodes.item(2)?.textContent).toBe('Los Angeles');
        await expect(table.lastElementChild?.childNodes.item(7)?.childNodes.item(2)?.textContent).toBe('Salt Lake City');

        await userEvent.click(sortByCityBtn);
        await userEvent.click(sortByCityBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByCityBtn.title).toContain('Zoradiť zostupne');

        await expect(sortByAgeBtn.previousElementSibling?.innerHTML).toContain('1');
        await expect(sortByCityBtn.previousElementSibling?.innerHTML).toContain('2');

        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Fiona');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Kevin');
        await expect(table.lastElementChild?.childNodes.item(6)?.childNodes.item(2)?.textContent).toBe('Salt Lake City');
        await expect(table.lastElementChild?.childNodes.item(7)?.childNodes.item(2)?.textContent).toBe('Los Angeles');
    },
    args: {
        // @ts-expect-error incorrect infering happens only in storybook args
        columns,
        data
    }
};

export const FetchedData: Story = {
    play: async ({ canvas, userEvent }) => {
        const table = canvas.getByRole('table');

        await new Promise((resolve) => setTimeout(resolve, 200));

        await expect(table.lastElementChild?.childElementCount).toBe(5);
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Alice');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Fiona');

        const prevBtn = canvas.getByTitle('Predchádzajúca strana');
        const nextBtn = canvas.getByTitle('Nasledujúca strana');
        const pageSelect = canvas.getByLabelText('Aktuálna strana');

        await expect(prevBtn).toBeDisabled();
        await expect(nextBtn).toBeEnabled();
        await expect(pageSelect).toHaveTextContent('1');

        await new Promise((resolve) => setTimeout(resolve, 200));

        await userEvent.click(nextBtn);
        await userEvent.click(nextBtn);
        await userEvent.click(nextBtn);

        await new Promise((resolve) => setTimeout(resolve, 200));

        await expect(pageSelect).toHaveTextContent('4');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Paula');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Thomas');
        await expect(prevBtn).toBeEnabled();

        await new Promise((resolve) => setTimeout(resolve, 200));

        await userEvent.click(nextBtn);
        await expect(nextBtn).toBeDisabled();
        await expect(pageSelect).toHaveTextContent('5');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Ursula');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Yara');

        await new Promise((resolve) => setTimeout(resolve, 200));

        await userEvent.click(prevBtn);
        await userEvent.click(prevBtn);
        await userEvent.click(prevBtn);
        await userEvent.click(prevBtn);

        await new Promise((resolve) => setTimeout(resolve, 200));

        await expect(prevBtn).toBeDisabled();
        await expect(nextBtn).toBeEnabled();
        await expect(pageSelect).toHaveTextContent('1');
    },
    args: {
        // @ts-expect-error incorrect infering happens only in storybook args
        columns,
        onFetch: fetchMethod,
        pageSize: 5
    }
};

type FetchResult = Awaited<ReturnType<typeof fetchMethod>>;

// Storybook drives user events outside act; enable its environment only while settling requests.
const act = async (callback: () => Promise<void>) => {
    const environment = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
    const previous = environment.IS_REACT_ACT_ENVIRONMENT;
    environment.IS_REACT_ACT_ENVIRONMENT = true;

    try {
        await reactAct(callback);
    } finally {
        environment.IS_REACT_ACT_ENVIRONMENT = previous;
    }
};

const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });

    return { promise, resolve, reject };
};

const createFetchRequests = () => {
    const requests: ReturnType<typeof deferred<FetchResult>>[] = [];
    const onFetch = fn<typeof fetchMethod>(() => {
        const request = deferred<FetchResult>();
        requests.push(request);

        return request.promise;
    });

    const resolve = async (index: number, name: string, page: number, totalRecords = 15) => {
        await act(async () => {
            requests[index].resolve({ data: [{ ...data[0], name }], page, pageSize: 5, totalRecords });
        });
    };

    const reject = async (index: number, error: Error) => {
        await act(async () => {
            requests[index].reject(error);
        });
    };

    return { requests, onFetch, resolve, reject };
};

export const OverlappingPagination: Story = {
    args: FetchedData.args,
    render: () => (
        <Table
            columns={columns}
            onFetch={fetchMethod}
            pageSize={5}
        />
    ),
    play: async ({ mount, userEvent }) => {
        const fetch = createFetchRequests();
        const canvas = await mount(
            <Table
                columns={columns}
                onFetch={fetch.onFetch}
                pageSize={5}
            />
        );
        await waitFor(() => expect(fetch.requests).toHaveLength(1));
        await fetch.resolve(0, 'Initial rows', 0);

        await userEvent.click(canvas.getByTitle('Nasledujúca strana'));
        await waitFor(() => expect(fetch.requests).toHaveLength(2));
        await userEvent.click(canvas.getByTitle('Nasledujúca strana'));
        await waitFor(() => expect(fetch.requests).toHaveLength(3));

        await fetch.resolve(2, 'Newest rows', 2);
        // An obsolete response must not reset the page or shrink the page count.
        await fetch.resolve(1, 'Obsolete rows', 1, 10);

        await expect(canvas.getByRole('table')).toHaveTextContent('Newest rows');
        await expect(canvas.queryByText('Obsolete rows')).not.toBeInTheDocument();
        await expect(canvas.getByLabelText('Aktuálna strana')).toHaveTextContent('3');
        await expect(canvas.getByTitle('Nasledujúca strana')).toBeDisabled();
        await expect(fetch.onFetch).toHaveBeenCalledTimes(3);
    }
};

export const PendingSortChange: Story = {
    args: FetchedData.args,
    render: () => (
        <Table
            columns={columns}
            onFetch={fetchMethod}
            pageSize={5}
        />
    ),
    play: async ({ mount, userEvent }) => {
        const fetch = createFetchRequests();
        const canvas = await mount(
            <Table
                columns={columns}
                onFetch={fetch.onFetch}
                pageSize={5}
            />
        );
        await waitFor(() => expect(fetch.requests).toHaveLength(1));
        await fetch.resolve(0, 'Initial rows', 0);
        await userEvent.click(canvas.getByTitle('Nasledujúca strana'));
        await waitFor(() => expect(fetch.requests).toHaveLength(2));
        await userEvent.click(canvas.getByTitle(/Name/));
        await waitFor(() => expect(fetch.requests).toHaveLength(3));
        await expect(fetch.onFetch).toHaveBeenLastCalledWith(0, 5, [{ accessor: 'name', direction: 'desc' }]);

        await fetch.resolve(2, 'Sorted rows', 0, 5);
        await fetch.resolve(1, 'Old sort rows', 1);

        await expect(canvas.getByRole('table')).toHaveTextContent('Sorted rows');
        await expect(canvas.queryByText('Old sort rows')).not.toBeInTheDocument();
        await expect(canvas.getByLabelText('Aktuálna strana')).toHaveTextContent('1');
        await expect(canvas.getByTitle('Nasledujúca strana')).toBeDisabled();
        await expect(fetch.onFetch).toHaveBeenCalledTimes(3);
    }
};

export const RequestRejectionAndCleanup: Story = {
    args: FetchedData.args,
    render: () => (
        <Table
            columns={columns}
            onFetch={fetchMethod}
            pageSize={5}
        />
    ),
    play: async ({ mount, userEvent }) => {
        const fetch = createFetchRequests();
        const originalError = console.error;
        const reportError = fn();
        console.error = reportError;

        try {
            const canvas = await mount(
                <Table
                    columns={columns}
                    onFetch={fetch.onFetch}
                    pageSize={5}
                />
            );
            await waitFor(() => expect(fetch.requests).toHaveLength(1));
            await fetch.resolve(0, 'Retained rows', 0);
            await userEvent.click(canvas.getByTitle('Nasledujúca strana'));
            await waitFor(() => expect(fetch.requests).toHaveLength(2));
            await userEvent.click(canvas.getByTitle('Nasledujúca strana'));
            await waitFor(() => expect(fetch.requests).toHaveLength(3));

            await fetch.reject(1, new Error('Obsolete failure'));
            await expect(reportError).not.toHaveBeenCalled();
            const error = new Error('Current failure');
            await fetch.reject(2, error);
            await expect(reportError).toHaveBeenCalledTimes(1);
            await expect(reportError).toHaveBeenCalledWith(error);
            await expect(canvas.getByRole('table')).toHaveTextContent('Retained rows');
            await expect(canvas.getByLabelText('Aktuálna strana')).toHaveTextContent('3');

            await userEvent.click(canvas.getByTitle('Predchádzajúca strana'));
            await waitFor(() => expect(fetch.requests).toHaveLength(4));
            await userEvent.click(canvas.getByTitle('Predchádzajúca strana'));
            await waitFor(() => expect(fetch.requests).toHaveLength(5));
            await mount(<div>Table unmounted</div>);
            // A mismatched page size would throw if the unmounted response were applied.
            await act(async () => {
                fetch.requests[4].resolve({ data: [], page: 0, pageSize: 99, totalRecords: 0 });
            });
            await fetch.reject(3, new Error('Unmounted failure'));
            await expect(reportError).toHaveBeenCalledTimes(1);
            await expect(reportError).toHaveBeenCalledWith(error);
        } finally {
            console.error = originalError;
        }
    }
};

export const EmptyFetchedData: Story = {
    args: FetchedData.args,
    play: async ({ mount, userEvent }) => {
        const fetch = createFetchRequests();
        const canvas = await mount(
            <Table
                columns={columns}
                onFetch={fetch.onFetch}
                pageSize={5}
            />
        );
        await waitFor(() => expect(fetch.requests).toHaveLength(1));

        const prev = canvas.getByTitle(localization.prevPage);
        const next = canvas.getByTitle(localization.nextPage);
        const current = canvas.getByLabelText(localization.currentPage);
        const expectEmptyPagination = async () => {
            await expect(prev).toBeDisabled();
            await expect(next).toBeDisabled();
            await expect(current).toBeDisabled();
            await expect(current).toHaveTextContent(/^0$/);
            await expect(current.parentElement?.parentElement).toHaveTextContent(`${localization.page}0 ${localization.of} 0`);
            await userEvent.click(prev);
            await userEvent.click(next);
            await userEvent.click(current);
            await expect(fetch.onFetch).toHaveBeenCalledTimes(1);
            await expect(fetch.onFetch).toHaveBeenLastCalledWith(0, 5, [{ accessor: 'name', direction: 'asc' }]);
        };

        // Totals are unknown until this controlled request resolves.
        await expectEmptyPagination();
        await act(async () => {
            fetch.requests[0].resolve({ data: [], page: 0, pageSize: 5, totalRecords: 0 });
        });
        await expect(canvas.getByRole('table').querySelector('tbody')).toBeEmptyDOMElement();
        await expectEmptyPagination();
    }
};

export const PaginationBoundaries: Story = {
    args: FetchedData.args,
    play: async ({ mount, userEvent }) => {
        const fetch = createFetchRequests();
        const canvas = await mount(
            <Table
                columns={columns}
                onFetch={fetch.onFetch}
                pageSize={5}
            />
        );
        await waitFor(() => expect(fetch.requests).toHaveLength(1));
        await fetch.resolve(0, 'First page', 0, 10);

        const prev = canvas.getByTitle(localization.prevPage);
        const next = canvas.getByTitle(localization.nextPage);
        const current = canvas.getByLabelText(localization.currentPage);
        await expect(prev).toBeDisabled();
        await expect(next).toBeEnabled();
        await expect(current).toHaveTextContent(/^1$/);
        await userEvent.click(prev);
        await expect(fetch.onFetch).toHaveBeenCalledTimes(1);

        await userEvent.click(next);
        await waitFor(() => expect(fetch.requests).toHaveLength(2));
        await fetch.resolve(1, 'Last page', 1, 10);
        await expect(prev).toBeEnabled();
        await expect(next).toBeDisabled();
        await expect(current).toHaveTextContent(/^2$/);
        await userEvent.click(next);
        await expect(fetch.onFetch).toHaveBeenCalledTimes(2);

        await userEvent.click(prev);
        await waitFor(() => expect(fetch.requests).toHaveLength(3));
        await fetch.resolve(2, 'First page', 0, 10);
        await expect(prev).toBeDisabled();
        await expect(next).toBeEnabled();
        await expect(current).toHaveTextContent(/^1$/);
        await expect(fetch.onFetch.mock.calls.map(([page]) => page)).toEqual([0, 1, 0]);

        // The page dropdown uses the same zero-based indexes as the arrows.
        await userEvent.click(current);
        await userEvent.click(canvas.getByRole('button', { name: /^2$/ }));
        await waitFor(() => expect(fetch.requests).toHaveLength(4));
        await fetch.resolve(3, 'Last page', 1, 10);
        await expect(current).toHaveTextContent(/^2$/);
        await expect(next).toBeDisabled();
        await expect(fetch.onFetch.mock.calls.map(([page]) => page)).toEqual([0, 1, 0, 1]);
    }
};
