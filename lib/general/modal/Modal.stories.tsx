import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { expect, fn } from 'storybook/test';
import { Button } from '..';
import { CheckIcon, FaceSmileIcon, HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ModalProps } from './Modal.types';

type StorybookOnlyProps = {
    cancelMode: 'default' | 'custom' | 'none';
};

const icons = {
    default: undefined,
    smile: FaceSmileIcon,
    trash: TrashIcon,
    check: CheckIcon
};

const onClose = fn();

const meta = {
    title: 'General/Modal',
    component: Modal,
    tags: ['autodocs'],
    argTypes: {
        onClose: { action: 'changed' },
        size: {
            table: {
                type: { summary: "'normal' | 'large'" }
            },
            control: 'radio',
            options: ['normal', 'large']
        },
        variant: {
            table: {
                type: { summary: "'primary' | 'danger'" }
            },
            control: 'radio',
            options: ['primary', 'danger']
        },
        confirmLabel: {
            control: 'text',
            description: 'Label for the confirmation button. **Note:** Default value is a localized.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: "'Confirm' (localized)" }
            }
        },
        cancelMode: {
            name: 'cancel Button Mode',
            control: 'radio',
            options: ['default', 'custom', 'none'],
            description: 'Choose if you want the default label, custom text, or no cancel button at all.'
        },

        cancelLabel: {
            control: { type: 'text' },
            nullable: true,
            if: { arg: 'cancelMode', eq: 'custom' },
            description: 'Label for the cancellation button. **Note:** Default value is a localized.',
            table: {
                type: { summary: 'string | null' },
                defaultValue: { summary: "'Cancel' (localized)" }
            }
        },
        icon: {
            control: 'select',
            mapping: icons,
            options: Object.keys(icons)
        },
        closedby: {
            description:
                'Determines how the user is allowed to close the dialog:\n' +
                '- **`none`** Blocks all automatic closing (ignores both ESC press and backdrop clicks).\n' +
                '- **`any`** Allows closing by any standard method (either ESC press or clicking the backdrop).\n' +
                '- **`closerequest`** Closes only via system requests (ESC press only, backdrop clicks are ignored).',
            table: {
                type: { summary: "'none' | 'any' | 'closerequest'" },
                defaultValue: { summary: 'any' }
            },
            control: {
                type: 'radio',
                labels: {
                    none: 'none',
                    any: 'any',
                    closerequest: 'closerequest'
                }
            },
            options: ['none', 'any', 'closerequest']
        }
    },
    render: ({ cancelMode, cancelLabel, openModal, onClose, ...args }, context) => {
        const [showModal, setShowModal] = useState(openModal);

        const cancelBtnFromStory = context.initialArgs.cancelLabel;
        const cancelBtnFromControls = cancelLabel;

        const finalCancelLabel = useMemo(() => {
            if (cancelBtnFromStory || cancelBtnFromStory === null) {
                return cancelBtnFromStory;
            } else if (cancelMode === 'none') {
                return null;
            } else if (cancelMode === 'custom') {
                return cancelBtnFromControls;
            } else {
                return undefined;
            }
        }, [cancelBtnFromControls, cancelBtnFromStory, cancelMode]);

        useEffect(() => {
            setShowModal(openModal);
        }, [openModal]);

        const onCloseHandler = useCallback(
            (confirm: boolean) => {
                if (onClose) {
                    onClose(confirm);
                }
                setShowModal(false);
            },
            [onClose]
        );

        return (
            <>
                <Button
                    variant='primary'
                    onClick={() => setShowModal(true)}
                >
                    Open modal
                </Button>

                <Modal
                    {...args}
                    openModal={showModal}
                    onClose={onCloseHandler}
                    cancelLabel={finalCancelLabel}
                />
            </>
        );
    },
    args: {
        onClose: onClose,
        title: 'This is modal title',
        body: 'This is modal body',
        openModal: false,
        cancelMode: 'custom'
    }
} satisfies Meta<ModalProps & StorybookOnlyProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LongerTitle: Story = {
    args: {
        title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    }
};

export const CustomBody: Story = {
    args: {
        body: (
            <>
                <div>Do you want to delete these items? </div>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            </>
        )
    }
};

export const NormalSize: Story = {
    args: {
        title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        size: 'normal'
    }
};

export const LargeSize: Story = {
    args: {
        title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        size: 'large'
    }
};

export const Primary: Story = {
    args: {
        variant: 'primary'
    }
};

export const Danger: Story = {
    args: {
        variant: 'danger'
    }
};

export const CustomLabels: Story = {
    args: {
        cancelLabel: 'Custom cancel',
        confirmLabel: 'Custom confirm',
        cancelMode: 'custom' // The cancelMode attribute is set as a helper attribute for stories only.
    }
};

export const WithoutConfirm: Story = {
    play: async ({ canvas, userEvent }) => {
        // open modal
        const openButton = canvas.getByRole('button', { name: 'Open modal' });
        await userEvent.click(openButton);

        const buttons = canvas.getAllByRole('button');
        await expect(buttons).toHaveLength(2);
        await expect(buttons[0]).toHaveTextContent('Open modal');
        await expect(buttons[1]).toHaveTextContent('Confirm');
    },

    args: {
        cancelLabel: null,
        cancelMode: 'none' // The cancelMode attribute is set as a helper attribute for stories only.
    }
};

export const BlocksAutomaticClosing: Story = {
    args: {
        closedby: 'none'
    }
};

export const AllowsAutomaticClosing: Story = {
    args: {
        closedby: 'any'
    }
};

export const EscPressOnlyClosing: Story = {
    args: {
        closedby: 'closerequest'
    }
};

export const CustomIcon: Story = {
    args: {
        icon: HeartIcon
    }
};

export const MoreCustomOptions: Story = {
    play: async ({ args, canvas, userEvent }) => {
        // open modal
        const openButton = canvas.getByRole('button', { name: 'Open modal' });
        await userEvent.click(openButton);

        // modal
        const modal = canvas.getByRole('dialog');
        await expect(modal).toBeInTheDocument();
        const modalTitle = await canvas.findByText('Deletion');
        await expect(modalTitle).toBeInTheDocument();
        const modalBody = canvas.getByText('Do you want to delete these items?');
        await expect(modalBody).toBeInTheDocument();
        const modalBodyItem = canvas.getByText('Item 1');
        await expect(modalBodyItem).toBeInTheDocument();
        const svgIcon = modal.querySelector('svg');
        await expect(svgIcon).toBeInTheDocument();
        await expect(svgIcon).toHaveClass('stroke-danger');

        const buttons = canvas.getAllByRole('button');
        await expect(buttons).toHaveLength(3);
        await expect(buttons[0]).toHaveTextContent('Open modal');
        await expect(buttons[1]).toHaveTextContent('No, thanks');
        await expect(buttons[2]).toHaveTextContent('Yes, delete');
        const className = buttons[2].getAttribute('class');
        expect(className).toContain('bg-danger');

        await expect(args.onClose).toHaveBeenCalledTimes(0);
        await userEvent.click(buttons[2]);
        await expect(args.onClose).toHaveBeenCalledTimes(1);
        await expect(args.onClose).toHaveBeenLastCalledWith(true);
        await userEvent.click(openButton);
        await userEvent.click(buttons[1]);
        await expect(args.onClose).toHaveBeenCalledTimes(2);
        await expect(args.onClose).toHaveBeenLastCalledWith(false);
    },

    args: {
        title: 'Deletion',
        body: (
            <>
                <div>Do you want to delete these items? </div>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            </>
        ),
        variant: 'danger',
        cancelLabel: 'No, thanks',
        confirmLabel: 'Yes, delete',
        icon: TrashIcon
    }
};
