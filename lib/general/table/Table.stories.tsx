import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from './Table';
import { Button } from '../button';
import { PencilIcon } from '@heroicons/react/16/solid';
import { type SortObject } from './Table.types';
import { createColumns } from './table-utils';
import { expect } from 'storybook/test';

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
        additionalClassName: 'min-w-[100px] border-l text-right sticky right-none bg-white',
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

        await expect(sortByNameBtn.title).toContain('Sorted ascending');
        await expect(sortByAgeBtn.title).toContain('Not sorted');
        await expect(sortByCityBtn.title).toContain('Not sorted');

        await userEvent.click(sortByNameBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByNameBtn.title).toContain('Sorted descending');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Yara');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Alice');

        await userEvent.click(sortByNameBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByNameBtn.title).toContain('Not sorted');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Bob');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Yara');

        await userEvent.click(sortByAgeBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByAgeBtn.title).toContain('Sorted ascending');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Fiona');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Kevin');
        await expect(table.lastElementChild?.childNodes.item(6)?.childNodes.item(2)?.textContent).toBe('Los Angeles');
        await expect(table.lastElementChild?.childNodes.item(7)?.childNodes.item(2)?.textContent).toBe('Salt Lake City');

        await userEvent.click(sortByCityBtn);
        await userEvent.click(sortByCityBtn);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(sortByCityBtn.title).toContain('Sorted descending');

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

        const prevBtn = canvas.getByTitle('Previous page');
        const nextBtn = canvas.getByTitle('Next page');
        const pageSelect = canvas.getByLabelText('Current page');

        await expect(prevBtn).toBeDisabled();
        await expect(nextBtn).toBeEnabled();
        await expect(pageSelect).toHaveValue('0');

        await new Promise((resolve) => setTimeout(resolve, 200));

        await userEvent.click(nextBtn);
        await userEvent.click(nextBtn);
        await userEvent.click(nextBtn);

        await new Promise((resolve) => setTimeout(resolve, 200));

        await expect(pageSelect).toHaveValue('3');
        await expect(table.lastElementChild?.firstElementChild?.firstElementChild?.innerHTML).toBe('Paula');
        await expect(table.lastElementChild?.lastElementChild?.firstElementChild?.innerHTML).toBe('Thomas');
        await expect(prevBtn).toBeEnabled();

        await new Promise((resolve) => setTimeout(resolve, 200));

        await userEvent.click(nextBtn);
        await expect(nextBtn).toBeDisabled();
        await expect(pageSelect).toHaveValue('4');
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
        await expect(pageSelect).toHaveValue('0');
    },
    args: {
        // @ts-expect-error incorrect infering happens only in storybook args
        columns,
        onFetch: fetchMethod,
        pageSize: 5
    }
};
