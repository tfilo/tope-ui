import { useEffect, useMemo, useRef } from 'react';
import type { ModalProps } from './Modal.types';
import { Button } from '..';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { localization } from '../../utils/constants';

const theme = {
    dialog: (size: ModalProps['size']) => {
        return `${size === 'normal' ? 'max-w-3xl' : 'max-w-7xl'} m-auto rounded-md shadow-2xl`;
    },
    wrapper: 'p-lg flex flex-row gap-lg',
    title: 'rounded-t-sm font-bold',
    body: 'pt-sm',
    icon: {
        base: 'h-[20px] w-[20px] shrink-0',
        color: {
            primary: 'stroke-primary',
            danger: 'stroke-danger'
        }
    },
    btns: 'bg-secondary-extra-light flex justify-end gap-md mt-md p-md rounded-b-md'
};

/** Modal component that renders as HTMLDialogElement */
const Modal: React.FC<ModalProps> = ({
    closedby = 'any', // should close dialog after backdrop click or esc press
    title,
    body,
    size = 'normal',
    variant = 'primary',
    openModal,
    onClose,
    cancelLabel,
    confirmLabel,
    icon,
    ...props
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const Icon = useMemo(() => {
        if (icon) {
            return icon;
        } else if (variant === 'danger') {
            return ExclamationTriangleIcon;
        } else return InformationCircleIcon;
    }, [icon, variant]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (openModal) {
            if (dialog.open) return; // Prevent opening if already open
            dialog.showModal();
        } else {
            if (!dialog.open) return; // Prevent closing if already closed
            dialog.close();
        }
    }, [openModal]);

    const onCloseHandler = async (confirm: boolean) => {
        if (onClose) {
            try {
                await onClose(confirm);
            } catch (e) {
                console.error(e);
            }
        }
    };

    /** This handler catches the ESC press and backdrop click */
    const handleOnCancel = async (event: React.SyntheticEvent) => {
        event.preventDefault(); // Prevent the native close to control it via React
        await onCloseHandler(false);
    };

    return (
        <dialog
            {...props}
            ref={dialogRef}
            onCancel={handleOnCancel}
            closedby={closedby}
            className={theme.dialog(size)}
        >
            <div className={theme.wrapper}>
                <Icon className={`${theme.icon.base} ${theme.icon.color[variant]}`} />
                <div>
                    <div className={theme.title}>{title}</div>
                    <div className={theme.body}>{body}</div>
                </div>
            </div>
            <div className={theme.btns}>
                {cancelLabel !== null && (
                    <Button
                        onClick={() => onCloseHandler(false)}
                        variant='secondary'
                    >
                        {cancelLabel ?? localization.modal.cancelLabel}
                    </Button>
                )}
                <Button
                    onClick={() => onCloseHandler(true)}
                    variant={variant}
                >
                    {confirmLabel ?? localization.modal.confirmLabel}
                </Button>
            </div>
        </dialog>
    );
};

export default Modal;
