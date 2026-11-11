import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bars3Icon, CameraIcon, MapIcon, UserIcon, UsersIcon } from '@heroicons/react/16/solid';

import { Content } from '../Content';
import { Page } from '../Page/Page';
import { Header } from './Header';

const meta = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        (Story) => (
            <div className='flex h-[600px] flex-col overflow-hidden'>
                <Story />
                <Content>
                    <Page title='Page content under header'>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat aliquam molestias odio provident, ut in nobis
                            ipsum eligendi cumque at officia nostrum quibusdam quasi optio velit quas suscipit necessitatibus voluptatem
                            aliquid quam saepe. Esse in aliquid itaque, tempora hic enim totam, doloribus perferendis consectetur nobis
                            saepe vero eum debitis maiores nesciunt ipsam harum rem veritatis quis distinctio molestiae delectus quo
                            incidunt nemo! Nam quasi dolorum voluptas quidem iusto, inventore qui molestiae illo perspiciatis. Harum,
                            eveniet cum deleniti voluptatibus vero amet itaque cumque quidem facere ea inventore et nihil corporis possimus
                            aliquid ullam nulla! Illum nisi quo a accusamus, ipsam natus!
                        </p>
                    </Page>
                </Content>
            </div>
        )
    ]
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const users = canvas.getByRole('button', { name: 'Users' });
        await expect(users).toBeVisible();
        await userEvent.click(users);

        const item = args.menu![0].menu![0];
        await userEvent.click(canvas.getByRole('button', { name: item.label }));
        await expect(item.onClick).toHaveBeenCalled();

        if (window.matchMedia('(width < 48rem)').matches) {
            await expect(canvas.getByText('Map')).not.toBeVisible();
        } else {
            await expect(canvas.getByText('Map')).toBeVisible();
        }

        const map = canvas.getByRole('button', { name: 'Map' });
        await expect(map).toBeVisible();
        await userEvent.click(map);
        await expect(args.menu![1].onClick).toHaveBeenCalled();

        const camera = canvas.getByRole('button', { name: 'Camera' });
        await expect(camera).toBeVisible();
        await userEvent.click(camera);
        await expect(args.menu![2].onClick).toHaveBeenCalled();

        const profile = canvas.getByRole('button', { name: 'Profil' });
        await expect(profile).toBeVisible();
        await userEvent.click(profile);
        await expect(args.onProfile).toHaveBeenCalled();

        const logout = canvas.getByRole('button', { name: 'Odhlásiť sa' });
        await expect(logout).toBeVisible();
        await userEvent.click(logout);
        await expect(args.onLogout).toHaveBeenCalled();
    },
    args: {
        menu: [
            {
                label: 'Users',
                icon: UsersIcon,
                menu: Array.from({ length: 30 }, (_, idx) => ({
                    label: 'User ' + (idx + 1),
                    icon: UserIcon,
                    onClick: fn()
                }))
            },
            {
                label: 'Map',
                icon: MapIcon,
                onClick: fn()
            },
            {
                label: 'Camera',
                icon: CameraIcon,
                onClick: fn()
            }
        ],
        onLogout: fn(),
        onProfile: fn()
    }
};

export const MenuOnly: Story = {
    args: {
        menu: Default.args?.menu
    }
};

export const LogoutOnly: Story = {
    args: {
        onLogout: fn()
    }
};

export const WithTooMuchMenuItems: Story = {
    args: {
        menu: Array.from({ length: 30 }, (_, idx) => ({
            label: 'Item ' + (idx + 1),
            icon: Bars3Icon,
            onClick: fn()
        })),
        onLogout: fn()
    }
};
