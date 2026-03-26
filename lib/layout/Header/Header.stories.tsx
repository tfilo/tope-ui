import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './Header';
import { Bars3Icon, CameraIcon, MapIcon, UserIcon, UsersIcon } from '@heroicons/react/16/solid';
import { expect, fn } from 'storybook/test';
import { Content } from '../Content';
import { Page } from '../Page/Page';

const meta = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        (Story) => (
            <div className='flex flex-col h-[600px] overflow-hidden'>
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
        const users = canvas.getByText('Users');
        await expect(users).toBeVisible();
        await expect(users.tagName).toBe('BUTTON');
        await userEvent.click(users);

        args.menu![0].menu!.forEach(async (item) => {
            const el = canvas.getByText(item.label);
            await expect(el).toBeVisible();
            await expect(el.tagName).toBe('BUTTON');
            await userEvent.click(el);
            await expect(item.onClick).toHaveBeenCalled();
        });

        const map = canvas.getByText('Map');
        await expect(map).toBeVisible();
        await expect(map.tagName).toBe('BUTTON');
        await userEvent.click(map);
        await expect(args.menu![1].onClick).toHaveBeenCalled();

        const camera = canvas.getByText('Camera');
        await expect(camera).toBeVisible();
        await expect(camera.tagName).toBe('BUTTON');
        await userEvent.click(camera);
        await expect(args.menu![2].onClick).toHaveBeenCalled();

        const profile = canvas.getByText('Profile');
        await expect(profile).toBeVisible();
        await expect(profile.tagName).toBe('BUTTON');
        await userEvent.click(profile);
        await expect(args.onProfile).toHaveBeenCalled();

        const logout = canvas.getByText('Logout');
        await expect(logout).toBeVisible();
        await expect(logout.tagName).toBe('BUTTON');
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

export const LogouyOnly: Story = {
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
