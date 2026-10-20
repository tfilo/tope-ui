import { expect, fn, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bars3Icon, CameraIcon, MapIcon, UserIcon, UsersIcon } from '@heroicons/react/16/solid';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

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

        const profile = canvas.getByText('Profil');
        await expect(profile).toBeVisible();
        await expect(profile.tagName).toBe('BUTTON');
        await userEvent.click(profile);
        await expect(args.onProfile).toHaveBeenCalled();

        const logout = canvas.getByText('Odhlásiť sa');
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

export const ServerRenderingAndHydration: Story = {
    args: {
        menu: [{ label: 'Map', icon: MapIcon, onClick: fn() }]
    },
    play: async ({ args, canvasElement }) => {
        const host = document.createElement('div');
        const originalWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
        const onRecoverableError = fn();
        let root: ReturnType<typeof hydrateRoot> | undefined;

        const resize = (width: number) => {
            Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
            window.dispatchEvent(new Event('resize'));
        };

        try {
            resize(767);
            host.innerHTML = renderToString(<Header {...args} />);
            canvasElement.appendChild(host);

            const serverHeader = host.firstElementChild;
            await expect(within(host).getByRole('button', { name: 'Map' })).toHaveTextContent('Map');

            root = hydrateRoot(host, <Header {...args} />, { onRecoverableError });

            await waitFor(() => expect(within(host).getByRole('button', { name: 'Map' }).textContent).toBe(''));
            await expect(host.firstElementChild).toBe(serverHeader);

            for (const width of [768, 1279, 1280]) {
                resize(width);
                await waitFor(() => expect(within(host).getByRole('button', { name: 'Map' })).toHaveTextContent('Map'));
            }

            resize(767);
            await waitFor(() => expect(within(host).getByRole('button', { name: 'Map' }).textContent).toBe(''));
            await expect(onRecoverableError).not.toHaveBeenCalled();
        } finally {
            root?.unmount();
            host.remove();

            if (originalWidth) Object.defineProperty(window, 'innerWidth', originalWidth);
            window.dispatchEvent(new Event('resize'));
        }
    }
};
